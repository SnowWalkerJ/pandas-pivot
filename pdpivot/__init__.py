import os
import json
import htmlPy
import numpy as np
import pandas as pd

class NonExitApp(htmlPy.AppGUI):
    def start(self):
        self.window.show()
        self.app.exec_()


class Backend(htmlPy.Object):
        def __init__(self, app, data):
            self.app = app
            self.data = data
            super(Backend, self).__init__()

        @htmlPy.Slot()
        def get_fields(self):
            data = []
            columns = list(self.data.columns)
            for col in columns:
                col_data = self.data[col]
                item = {
                    'type': 'category' if col_data.dtype.name == "category" else 'numeric',
                    'name': col,
                }
                if item['type'] == 'category':
                    item['unique'] = [str(x) for x in col_data.unique()]
                data.append(item)
                
            cmd = 'init_fields(%s)' % json.dumps(data)
            self.app.evaluate_javascript(cmd)

        @htmlPy.Slot(str, str, str, str)
        def refresh_table(self, columns, index, values, method):
            columns = columns.split('|')[1:]
            index = index.split('|')[1:]
            values = values.split('|')[1:]
            assert method in ('count', 'distinct', 'sum', 'mean', 'std', 'var'), method
            if method == 'count':
                method = len
            elif method == 'distinct':
                method = lambda x: len(pd.unique(x))
            if not (columns and index and values):
                table = self.data
            else:
                table = pd.pivot_table(self.data, values=values, columns=columns, index=index, margins=True, margins_name='Total', aggfunc=method)
            self.show_table(table)

        def show_table(self, table):
            html = table.to_html(classes="table table-bordered table-condensed table-hover", na_rep="", max_rows=50)
            cmd = '$("div#table").html(%s)' % repr(html)
            self.app.evaluate_javascript(cmd)


def pivot_table(data, categories=None):
    """
    Show the table in a new window.

    Parameters
    ==========
    data: pd.DataFrame
        table to show
    categories: List[str]
        names of the fields that are categorical.
        Only categorical columns can be made as columns and
        index in pivot.
    """
    app = NonExitApp(developer_mode=True, maximized=True)
    data = data.copy()
    if categories:
        data[categories] = data[categories].apply(pd.Categorical)
    backend = Backend(app, data)
    app.bind(backend)
    app.static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "statics")
    app.template_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")
    app.template = ("index.html", {})
    app.start()
    

if __name__ == '__main__':
    data = pd.DataFrame({
        'method': ['rnn', 'cnn', 'lstm'] * 3,
        'loss': np.random.randn(9),
        'data': ['data1'] * 3 + ['data2'] * 3 + ['data3'] * 3
    })
    pivot_table(data, categories=['method', 'data'])
