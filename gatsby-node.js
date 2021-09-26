const { createFilePath } = require(`gatsby-source-filesystem`);

const _ = require("lodash");
const path = require("path");

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    if (node.internal.type === `Mdx`) {
        const slug = path.join('/lessen', createFilePath({ node, getNode, basePath: "content", trailingSlash: true }));
        const getParentSlug = (slug) => {
            return `${path.parse(slug).dir}/`;
        };
        
        const parentSlug = getParentSlug(slug);
        const grandParentSlug = getParentSlug(parentSlug);
        const greatGrandParentSlug = getParentSlug(grandParentSlug);

        createNodeField({
            node,
            name: `slug`,
            value: slug,
        });

        if (isLesson(node)) {
            createNodeField({
                node,
                name: `content_type`,
                value: `lesson`,
            });
            createNodeField({
                node,
                name: `chapter_slug`,
                value: parentSlug,
            });
            createNodeField({
                node,
                name: `course_slug`,
                value: grandParentSlug,
            });
            createNodeField({
                node,
                name: `all_courses_slug`,
                value: greatGrandParentSlug,
            });
        } else if(isChapter(node)) {
            createNodeField({
                node,
                name: `content_type`,
                value: `chapter`,
            });
            createNodeField({
                node,
                name: `course_slug`,
                value: parentSlug,
            });
            createNodeField({
                node,
                name: `all_courses_slug`,
                value: grandParentSlug,
            });
        } else if(isCourse(node)) {
            createNodeField({
                node,
                name: `content_type`,
                value: `course`,
            });
            createNodeField({
                node,
                name: `all_courses_slug`,
                value: parentSlug,
            });
        } else if(isAllCourses(node)) {
            createNodeField({
                node,
                name: `content_type`,
                value: `all_courses`,
            });
        }
    }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter @dontInfer {
      tags: [String!]
      description: String
      date: Date @dateformat
      title: String!
      image: File @fileByRelativePath
      weight: Int
      level: Int
    }
  `
  createTypes(typeDefs)
}

function isIndexAtDepth(node, depth) {
    const re = new RegExp(`\/content(\/[^/]+){${depth}}\/index\.mdx$`);
    return re.test(node.fileAbsolutePath);
}

function isLesson(node) {
    return isIndexAtDepth(node, 3);
}

function isChapter(node) {
    return isIndexAtDepth(node, 2); 
}

function isCourse(node) {
    return isIndexAtDepth(node, 1);
}

function isAllCourses(node) {
    return isIndexAtDepth(node, 0);
}

/**
 * Converts the node to the lodash path it would have in the content tree.
 * @param { MdxNode } node The MDX node.
 * @return { String[] } The lodash path of the node, based on its slug
 */
function nodeToPath(node) {
    const slug = node.fields.slug;
    const slugItems = slug.split("/").slice(1, -1);
    const pathItems = [];
    slugItems.forEach((item, index) => {
        if (index < slugItems.length - 1) {
            pathItems.push(item);
            pathItems.push("contents");
        } else if (isLesson(node)) {
            pathItems.push(item);
        } else {
            pathItems.push(item);
            pathItems.push("section");
        }
    });

    return pathItems;
}

/**
 * Removes "section" or "contents" from the path of a node to get the common ancestor node path.
 * @param { string[] } nodePath The node path.
 */
function popSectionOrContents(nodePath) {
    const lastElement = nodePath.slice(-1)[0];
    if (lastElement === "section" || lastElement === "contents") {
        nodePath.pop();
    }
    return nodePath;
}

/**
 * Returns an array of lodash paths of the ancestors of the given node. The
 * first element is the path of closest ancestor to the node. The last
 * element is the path of the root ancestor node.
 * @param { MdxNode } node The MDX node.
 * @return { String[][] } The lodash paths of the node's ancestors.
 */
function nodeToParentPaths(node) {
    const nodePath = popSectionOrContents(nodeToPath(node));

    const parentPaths = [];
    for (let i = 1; i < nodePath.length; i += 2) {
        const parentPath = nodePath.slice(0, -i);
        parentPath.pop(); // Pop "contents"
        parentPath.push("section");
        parentPaths.push(parentPath);
    }

    return parentPaths;
}

/**
 * Returns an array of lodash paths of the children of the given node.
 * @param { MdxNode } node The MDX node.
 * @param { object } contentTree The content tree that contains the node and all
 * @return { String[][] } The lodash paths of the node's children.
 */
function nodeToChildPaths(node, contentTree) {
    const nodePath = popSectionOrContents(nodeToPath(node));
    nodePath.push("contents");
    const contentsNode = _.get(contentTree, nodePath);
    const childPaths = Object.keys(contentsNode).map(k => [...nodePath, k]);
    childPaths.sort((p1, p2) => _.get(contentTree, p1).frontmatter.weight - _.get(contentTree, p2).frontmatter.weight);
    return childPaths;
}

/**
 * Returns an array of lodash paths of the siblings of the given node. The
 * siblings are ordered according to their weight and include the node itself.
 * @param { MdxNode } node The MDX node.
 * @param { object } contentTree The content tree that contains the node and all
 * other content and section nodes.
 * @return { String[][] } The lodash paths of the node's siblings.
 */
function nodeToSiblingPaths(node, contentTree) {
    const parentPath = nodeToParentPaths(node)[0];
    const parentNode = _.get(contentTree, parentPath);
    return nodeToChildPaths(parentNode, contentTree);
}

/**
 * Get the breadcrumbs for the given node, based on the given content tree.
 * @param { MdxNode } node The MDX node for which to get a list of crumbs.
 * @param { object } contentTree The content tree that contains the node and all
 * other content and section nodes.
 * @return { object[] } The breadcrumbs as an array where each element has a
 * property `title` and `slug`.
 */
function nodeToCrumbs(node, contentTree) {
    let nodes = nodeToParentPaths(node);
    nodes = nodes.map(path => _.get(contentTree, path));
    nodes = nodes.reverse();
    nodes.push(node);
    return nodes.map(item => {
        return { title: item.frontmatter.title, slug: item.fields.slug };
    });
}

/**
 * Get the lessons in the given chapter node, based on the given content tree.
 * @param { MdxNode } chapterNode The chapter node.
 * @param { object } contentTree The content tree that contains the node and all
 * other content and section nodes.
 * @return { object[] } The lessons in the chapter as an array where each element
 * has a property `title` and `slug`.
 */
function chapterLessons(chapterNode, contentTree) {
    const lessonPaths = nodeToPath(chapterNode);
    lessonPaths.pop(); // Remove "section"
    lessonPaths.push("contents");
    lessonNodes = _.get(contentTree, lessonPaths);
    return Object.entries(lessonNodes).map(([key, node]) => {
        return {
            title: node.frontmatter.title,
            slug: node.fields.slug,
        };
    });
}

function addNodeToTree(node, tree) {
    const nodePath = nodeToPath(node);
    _.set(tree, nodePath, node);
}

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;

    const result = await graphql(`
        {
            allMdx(sort: { order: ASC, fields: [frontmatter___weight] }) {
                edges {
                    node {
                        fileAbsolutePath
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                            weight
                        }
                    }
                }
            }
        }
    `);

    // Handle errors
    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`);
        return;
    }

    const contentTree = {};
    result.data.allMdx.edges.forEach(({ node }) => addNodeToTree(node, contentTree));

    result.data.allMdx.edges.forEach(({ node }) => {
        if (isLesson(node)) {
            const siblings = nodeToSiblingPaths(node, contentTree).map(p => _.get(contentTree, p));
            const siblingSlugs = siblings.map(s => s.fields.slug);
            const pageIdx = siblingSlugs.findIndex(s => s === node.fields.slug);
            const prevNode = pageIdx - 1 >= 0 ? siblings[pageIdx - 1] : null;
            const nextNode = pageIdx + 1 < siblings.length ? siblings[pageIdx + 1] : null;
            createPage({
                path: node.fields.slug,
                component: require.resolve("./src/templates/lesson.tsx"),
                context: {
                    filePath: node.fileAbsolutePath,
                    nextPath: nextNode ? nextNode.fileAbsolutePath : null,
                    prevPath: prevNode ? prevNode.fileAbsolutePath : null,
                    crumbs: nodeToCrumbs(node, contentTree),
                },
            });
            createPage({
                path: path.join("/bare", node.fields.slug),
                component: require.resolve("./src/templates/lesson_bare.tsx"),
                context: {
                    filePath: node.fileAbsolutePath,
                },
            });
        } else if (isChapter(node)) {
            createPage({
                path: node.fields.slug,
                component: require.resolve("./src/templates/chapter.tsx"),
                context: {
                    slug: node.fields.slug,
                    crumbs: nodeToCrumbs(node, contentTree),
                    title: node.frontmatter.title,
                },
            });
        } else if (isCourse(node)) {
            const nodePath = nodeToPath(node, contentTree);
            nodePath.pop(); // Pop "section"
            createPage({
                path: node.fields.slug,
                component: require.resolve("./src/templates/course.tsx"),
                context: {
                    slug: node.fields.slug,
                    crumbs: nodeToCrumbs(node, contentTree),
                    title: node.frontmatter.title,
                    tree: _.get(contentTree, nodePath),
                },
            });
        } else if (isAllCourses(node)) {
            const nodePath = nodeToPath(node, contentTree);
            nodePath.pop(); // Pop "section"
            createPage({
                path: node.fields.slug,
                component: require.resolve("./src/templates/allCourses.tsx"),
                context: {
                    slug: node.fields.slug,
                    crumbs: nodeToCrumbs(node, contentTree),
                    title: node.frontmatter.title,
                    tree: _.get(contentTree, nodePath),
                },
            });
        }
    });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "content"), "node_modules"]
    }
  });
};