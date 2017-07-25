# pandas-pivot

`pandas-pivot` is a single-function module that allows you to check and pivot pandas DataFrame easily.
This project is supported by jQuery, jQuery-UI and bootstrap.

## Usage

```python
data = pd.DataFrame({
    'method': ['method1', 'method2', 'method3'] * 9,
    'loss': np.random.randn(27),
    'data': (['data1'] * 3 + ['data2'] * 3 + ['data3'] * 3) * 3,
    'user': np.random.binomial(1, 0.5, 27)
})
# Make data
```
```python
from pdpivot import pivot_table
pivot_table(data, categories=['method', 'data', 'user'])   # Show the table
```
