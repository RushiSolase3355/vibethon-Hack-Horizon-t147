export const mentorSuggestions = [
  "Explain overfitting simply",
  "What is CNN?",
  "Difference between AI and ML?"
];

export const playgroundSnippets = [
  {
    id: "hello-python",
    label: "Python Hello World",
    language: "python",
    code: `print("Hello from AIMLverse")
for step in ["Learn", "Practice", "Build"]:
    print(step)`,
    output: `Hello from AIMLverse
Learn
Practice
Build`
  },
  {
    id: "pandas-sample",
    label: "Pandas Sample",
    language: "python",
    code: `import pandas as pd

data = pd.DataFrame({
    "name": ["Priya", "Arjun", "Riya"],
    "xp": [1420, 1380, 1320]
})

print(data.head())`,
    output: `    name    xp
0  Priya  1420
1  Arjun  1380
2   Riya  1320`
  },
  {
    id: "regression-sample",
    label: "Regression Sample",
    language: "python",
    code: `from sklearn.linear_model import LinearRegression

X = [[600], [900], [1200], [1500]]
y = [8.0, 12.5, 16.0, 20.2]

model = LinearRegression().fit(X, y)
prediction = model.predict([[1100]])
print(round(prediction[0], 2))`,
    output: `14.76`
  }
] as const;
