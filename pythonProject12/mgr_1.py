import seaborn as sn
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder

_label_encoder = LabelEncoder()

if __name__ == '__main__':
    data = pd.read_csv('./tests_with_k/cumulative_with_option_3.csv')
 
    result = pd.crosstab(index=data['knowledge_base'], columns=data['Rule_count'])
