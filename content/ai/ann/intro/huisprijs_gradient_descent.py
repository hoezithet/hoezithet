# %%
import math

# %%
import pandas as pd
import numpy as np

# %%
def run(seed):
    # Gegevens
    np.random.seed(seed)
    n = 5
    oppervlaktes = np.random.randint(60, 150, size=n)
    afstanden = np.round(np.random.uniform(0.5, 10, size=n), 1)
    ruis = np.round(np.random.normal(0, 10, size=n)) * 1000

    # Prijsmodel met ruis
    prijzen = 3000 * oppervlaktes - 4000 * afstanden + ruis
    # prijzen = 3100 * oppervlaktes - 2500 * afstanden + ruis
    prijzen = (np.round(prijzen / 1000) * 1000).astype(int)

    theta = np.array([[3000], [-2500]], dtype=np.float32)  # 2x1

    df = pd.DataFrame({
        "Oppervlakte": oppervlaktes,
        "Afstand": afstanden,
        "Prijs": prijzen
    })

    # Voor gradient descent werken we met numpy arrays
    X = df[["Oppervlakte", "Afstand"]].values
    y_data = df["Prijs"].values.reshape(-1, 1)

    # -------------------------------
    # Gradient Descent Parameters
    # -------------------------------
    alpha = 0.0003            # learning rate
    iterations = 100000
    m = len(y_data)

    cost_history = []
    theta_history = []

    def compute_cost(X, y, theta):
        predictions = X @ theta
        errors = predictions - y
        cost = np.mean(errors ** 2)
        return cost

    for i in range(iterations):
        cost_history.append(compute_cost(X, y_data, theta))
        theta_history.append(theta.squeeze().copy())

        predictions = X @ theta
        errors = predictions - y_data
        gradients = (1 / (2*m)) * (X.T @ errors)
        theta -= alpha * gradients
        if len(cost_history) > 1 and cost_history[-2] - cost_history[-1] == 0:
            break

    theta_history = np.stack(theta_history)
    cost_history = np.stack(cost_history)

    df['Pred 0'] = df[['Oppervlakte', 'Afstand']].values @ theta_history[0]
    df['Pred'] = df[['Oppervlakte', 'Afstand']].values @ theta_history[-1]
    df['Abs Err 0'] = (df['Pred 0'] - df['Prijs']).abs()
    df['Abs Err'] = (df['Pred'] - df['Prijs']).abs()
    return df, theta_history, cost_history


# %%
df, theta_history, cost_history = run(2)
df = df.sample(frac=1, random_state=0).reset_index(drop=True)

# %%
df

# %%
print(df[['Pred 0']].to_markdown(index=False))

# %%
df['Fout'] = (df['Prijs'] - df['Pred 0'])
df['Kwadratische fout'] = (df['Prijs'] - df['Pred 0']) ** 2

# %%
print(df[['Fout', 'Kwadratische fout']].to_markdown(index=False))

# %%
np.format_float_scientific(df['Abs Err 0'].mean() ** 2)

# %%
160

# %%
import matplotlib.pyplot as plt

# %%
plt.plot(cost_history)
plt.yscale('log')

# %%
X = df[["Oppervlakte", "Afstand"]].values
y = df["Prijs"].values.reshape(-1, 1)

x1s = np.linspace(2500, 4000, num=1000, dtype=np.float32)
x2s = np.linspace(-10000, 5000, num=1000, dtype=np.float32)

theta_grid = np.stack(np.meshgrid(x1s, x2s)).reshape(2, -1)  # 2 x G
pred_grid = (X @ theta_grid)  # N x G
error_grid = (pred_grid - y)  # N x G
cost_grid = np.mean(error_grid ** 2, axis=0)  # N

# %%
from matplotlib import cm

Gx, Gy = theta_grid
Gx = Gx.reshape(1000, 1000)
Gy = Gy.reshape(1000, 1000)
Gz = cost_grid.reshape(1000, 1000)

fig, ax = plt.subplots(subplot_kw={"projection": "3d"})
surf = ax.plot_surface(Gx, Gy, Gz, cmap=cm.coolwarm,
                       linewidth=0, antialiased=False)

# %%
cost_grid

# %%

# %%

# %%
