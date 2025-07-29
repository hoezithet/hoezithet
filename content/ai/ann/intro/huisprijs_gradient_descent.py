import math

import pandas as pd
import numpy as np

# Gegevens
np.random.seed(15)
n = 10
oppervlaktes = np.random.randint(60, 150, size=n)
afstanden = np.round(np.random.uniform(0.5, 10, size=n), 1)
ruis = np.round(np.random.normal(0, 10, size=n)) * 1000

# Prijsmodel met ruis
prijzen = 3100 * oppervlaktes - 2400 * afstanden + ruis
prijzen = (np.round(prijzen / 500) * 500).astype(int)

# DataFrame
df = pd.DataFrame({
    "Oppervlakte": oppervlaktes,
    "Afstand": afstanden,
    "Prijs": prijzen
})

# data = [
#     # {"Oppervlakte": 160, "loc": (51.0594772, 3.6985919), "Prijs": 415000},
#     {"Oppervlakte": 154, "loc": (51.0606290, 3.7044363), "Prijs": 465000},
#     # {"Oppervlakte": 129, "loc": (51.0564338, 3.7359513), "Prijs": 497500},
#     # {"Oppervlakte": 115, "loc": (51.0613284, 3.7173955), "Prijs": 495000},
#     {"Oppervlakte": 91, "loc": (51.0642533, 3.7123108), "Prijs": 336000},
#     {"Oppervlakte": 136, "loc": (51.0377178, 3.7455237), "Prijs": 374000},
#     {"Oppervlakte": 142, "loc": (51.0201180, 3.7244610), "Prijs": 348000},
#     # {"Oppervlakte": 85, "loc": (51.0566159, 3.7143252), "Prijs": 396000},
#     # {"Oppervlakte": 72, "loc": (51.0468237, 3.7414830), "Prijs": 329000},
#     # {"Oppervlakte": 350, "loc": (51.0571108, 3.7096547), "Prijs": 599000},
#     # {"Oppervlakte": 177, "loc": (51.0442724, 3.7574044), "Prijs": 459000},
#     {"Oppervlakte": 136, "loc": (51.0377178, 3.7455237), "Prijs": 374000},
#     {"Oppervlakte": 160, "loc": (50.9846842, 3.7980847), "Prijs": 449000},
#     {"Oppervlakte": 180, "loc": (51.0534517, 3.7679519), "Prijs": 514000},
# 
#     # {"Oppervlakte": , "loc": , "Prijs": },
# ]
# 
# # DataFrame aanmaken
# df = pd.DataFrame(data)
# 
# belfort_loc = np.array((51.0536348, 3.7249126))
# 
# 
# def haversine_distance(coord1, coord2):
#     """
#     Calculate the great-circle distance between two points
#     on the Earth specified by (latitude, longitude) in decimal degrees.
# 
#     Parameters:
#         coord1: tuple of float (lat1, lon1)
#         coord2: tuple of float (lat2, lon2)
# 
#     Returns:
#         Distance in kilometers as a float
#     """
#     # Radius of the Earth in kilometers
#     R = 6371.0
# 
#     lat1, lon1 = coord1
#     lat2, lon2 = coord2
# 
#     # Convert decimal degrees to radians
#     phi1 = math.radians(lat1)
#     phi2 = math.radians(lat2)
#     delta_phi = math.radians(lat2 - lat1)
#     delta_lambda = math.radians(lon2 - lon1)
# 
#     # Haversine formula
#     a = math.sin(delta_phi / 2)**2 + \
#         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
# 
#     c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
# 
#     # Distance in kilometers
#     distance = R * c
#     return distance
# 
# 
# df['Afstand'] = df['loc'].apply(lambda l1: haversine_distance(l1, belfort_loc))

# Voor gradient descent werken we met numpy arrays
X_data = df[["Oppervlakte", "Afstand"]].values
y_data = df["Prijs"].values.reshape(-1, 1)

# Normaliseren van X voor betere convergentie (optioneel maar aanbevolen)
X_mean = X_data.mean(axis=0)
X_std = X_data.std(axis=0)
X_norm = (X_data - X_mean) / X_std

# -------------------------------
# Gradient Descent Parameters
# -------------------------------
alpha = 0.001            # leersnelheid
iterations = 100000
m = len(y_data)

# # Omdat we werken met genormaliseerde features, starten we met:
theta = np.array([[3000 / X_std[0]], [-2500 / X_std[1]]])  # 3x1

# Opslaan van kost voor visualisatie (optioneel)
cost_history = []
theta_history = []


# Hulp-functie om de kost (MSE) te berekenen
def compute_cost(X, y, theta):
    predictions = X @ theta
    errors = predictions - y
    cost = (1 / (2 * m)) * np.sum(errors ** 2)
    return cost


def denorm_theta(theta):
    # Omzetten naar oorspronkelijke schaal (denormaliseren)
    theta_0 = theta[0, 0] / X_std[0]
    theta_1 = theta[1, 0] / X_std[1]
    return np.array([theta_0, theta_1])


# Gradient descent loop
for i in range(iterations):
    theta_denormalized = denorm_theta(theta)
    cost_history.append(compute_cost(X_norm, y_data, theta))
    theta_history.append(theta_denormalized.squeeze())

    predictions = X_norm @ theta
    errors = predictions - y_data
    gradients = (1 / m) * (X_norm.T @ errors)
    theta -= alpha * gradients
    if len(cost_history) > 1 and cost_history[-2] - cost_history[-1] == 0:
        break

theta_history = np.stack(theta_history)
cost_history = np.stack(cost_history)

df['Pred'] = df[['Oppervlakte', 'Afstand']].values @ theta_denormalized
df['Abs Err'] = (df['Pred'] - df['Prijs']).abs()
