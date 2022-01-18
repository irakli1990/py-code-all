from tkinter import *
from tkinter import ttk
from scipy import cluster
from sklearn.metrics import silhouette_score
from sklearn import preprocessing
from warnings import simplefilter
from scipy.cluster.hierarchy import ward, single, complete, average
from scipy.spatial.distance import squareform, pdist
import xml.etree.ElementTree as Et
import tkinter.filedialog
from collections import defaultdict
from collections import Counter
import math

import time

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

simplefilter("ignore", cluster.hierarchy.ClusterWarning)
encoder = preprocessing.LabelEncoder()
scalar = preprocessing.MinMaxScaler()


def select_knowledge_base():
    etree = Et.parse(tkinter.filedialog.askopenfilename())
    return etree.getroot()


def select_knowledge_base_rules(knowledge_base):
    rule_attr_list = [xml.attrib for xml in knowledge_base.iter('rule')]
    rule_attr_dict = rule_attr_list.copy()
    rule_attr_data_frame = pd.DataFrame(list(rule_attr_dict))
    return rule_attr_data_frame


def select_knowledge_base_attributes(knowledge_base):
    attribute_attr_list = [a.attrib for a in knowledge_base.find('attributes').iter('name')]
    attribute_attr_dict = attribute_attr_list.copy()
    attributes_attr_data_frame = pd.DataFrame(list(attribute_attr_dict))
    attributes_attr_data_frame.drop('valueID', axis='columns', inplace=True)
    attributes_attr_data_frame.dropna(subset=['attributeID'], inplace=True)
    return attributes_attr_data_frame


def init_rule_matrix(rule_data_frame, attribute_data_frame):
    for x in attribute_data_frame.values:
        rule_data_frame['attr_' + x] = np.nan
    return rule_data_frame


def get_rule_by_id(xml_root, id_rule):
    for rule in xml_root.iter('rule'):
        if rule.attrib['ruleID'] == id_rule:
            return rule


def populate_matrix_with_conditions(knowledge_base, data_frame):
    for i in range(len(list(data_frame.ruleID))):
        for k in list(get_rule_by_id(knowledge_base, data_frame.ruleID[i]).find('conditions')):
            data_frame.loc[
                data_frame['ruleID'] == data_frame.ruleID[i],
                str('attr_' + list(k)[0].attrib['attributeID'])] = list(k)[2].text
    return data_frame


def populate_matrix_with_conclusions(knowledge_base, data_frame):
    for i in range(len(list(data_frame.ruleID))):
        for k in list(get_rule_by_id(knowledge_base, data_frame.ruleID[i]).find('conclusion')):
            data_frame.loc[
                data_frame['ruleID'] == data_frame.ruleID[i], str(
                    'attr_' + list(k)[0].attrib['attributeID'])] = list(k)[2].text
    return data_frame


def get_symbolic_values(knowledge_base):
    symbolic_value = []
    t = [a for a in knowledge_base.find('attributes').iter('symbolic_value')]
    for x in range(len(list(t))):
        symbolic_value.append(list(t)[x].find('name').text)
    return set(symbolic_value)


def normailise_types_of_column_values(data_frame, column):
    try:
        data_frame[column] = pd.to_numeric(data_frame[column], downcast="float")
    except:
        data_frame[column] = data_frame[column].astype(str)


def compute_result(data, distance_type, linkage_type):
    plt.figure(figsize=(20, 7))
    t = 0
    grouped = []
    dist = pdist(data, distance_type)
    if linkage_type == 'complete':
        start = time.time()
        grouped = complete(dist)
        end = time.time()
        t = end - start
    if linkage_type == 'average':
        start = time.time()
        grouped = average(dist)
        end = time.time()
        t = end - start
    if linkage_type == 'ward':
        start = time.time()
        grouped = ward(dist)
        end = time.time()
        t = end - start
    if linkage_type == 'single':
        start = time.time()
        grouped = single(dist)
        end = time.time()
        t = end - start
    d = cluster.hierarchy.dendrogram(grouped, labels=data.index)
    k_l = cluster.hierarchy.fcluster(grouped, len(get_cluster_classes(d)), 'maxclust', R=None,
                                     monocrit=None)
    plt.title(f'Hierarchical Clustering Dendrogram - {distance_type} distance, {linkage_type} linkage')
    plt.show()
    return t, d, k_l, dist


def compute_result_k(data, distance_type, linkage_type, k):
    plt.figure(figsize=(20, 7))
    t = 0
    grouped = []
    dist = pdist(data, distance_type)
    if linkage_type == 'complete':
        start = time.time()
        grouped = complete(dist)
        end = time.time()
        t = end - start
    if linkage_type == 'average':
        start = time.time()
        grouped = average(dist)
        end = time.time()
        t = end - start
    if linkage_type == 'ward':
        start = time.time()
        grouped = ward(dist)
        end = time.time()
        t = end - start
    if linkage_type == 'single':
        start = time.time()
        grouped = single(dist)
        end = time.time()
        t = end - start
    d = cluster.hierarchy.dendrogram(grouped, labels=data.index)
    k_l = cluster.hierarchy.fcluster(grouped, k, 'maxclust', R=None,
                                     monocrit=None)
    plt.title(f'Hierarchical Clustering Dendrogram - {distance_type} distance, {linkage_type} linkage')
    plt.show()
    return t, d, k_l, dist


def is_nan(x):
    return x != x


def get_cluster_classes(den, label='ivl'):
    cluster_idxs = defaultdict(list)
    for c, pi in zip(den['color_list'], den['icoord']):
        for leg in pi[1:3]:
            i = (leg - 5.0) / 10.0
            if abs(i - int(i)) < 1e-5:
                cluster_idxs[c].append(int(i))

    cluster_classes = {}
    for c, l in cluster_idxs.items():
        i_l = [den[label][i] for i in l]
        cluster_classes[c] = i_l

    return cluster_classes


def get_prepared_data():
    k_base = select_knowledge_base()
    k_rules = select_knowledge_base_rules(k_base)
    k_attributes = select_knowledge_base_attributes(k_base)
    init_data = init_rule_matrix(k_rules, k_attributes)
    populate_matrix_with_conditions(k_base, init_data)
    populate_matrix_with_conclusions(k_base, init_data)
    data = init_data.set_index('ruleID')
    if 'number' in data:
        data.drop('number', axis=1, inplace=True)
    return k_base.attrib.get('kbName'), data


def encode_data(x):
    for column in x.columns:
        column_values = x[column][is_nan(x[column]) == False].values
        for i in sorted(set(column_values)):
            x.loc[x[column] == i, column] = sorted(set(column_values)).index(i) + 1


def init_result_df():
    columns = {'knowledge_base', 'Rule_count', 'Atribute_count', 'Cluster_count', 'Distance_messure',
               'Linkage_method', 'Largest_group_count', 'Smalest_group_count', 'Computation_time',
               'silhouette_score'}
    result_df = pd.DataFrame(columns=columns)
    return result_df


def init_result_df_k():
    columns = {'knowledge_base', 'Rule_count', 'Atribute_count', 'Cluster_count', 'Distance_messure',
               'Linkage_method', 'Largest_group_count', 'Smalest_group_count', 'Computation_time', 'k1', 'k2',
               'silhouette_score_k1',
               'silhouette_score_k2'}
    result_df = pd.DataFrame(columns=columns)
    return result_df


def r_n(n):
    p = lambda x: x / 100
    p_n = p(n)
    return p_n


if __name__ == '__main__':
    kb_name, d_table = get_prepared_data()
    encode_data(x=d_table)
    d_table_x = d_table.fillna('*')
    d_table = d_table.fillna(0)
    print(d_table)

result = init_result_df()

distance_type = ''
linkage_type = ''
distance_ans = ''
linkage_ans = ''

while True:
    while True:
        print("""
        1.Euclidean
        2.Canberra
        3.Manhattan
        4.Chebyshev
        5.Exit/Quit
        """)
        distance_ans = input("Choose distance measure:")
        if distance_ans == "1":
            print('***********************************')
            distance_type = 'euclidean'
            print('******Distance type euclidean******')
            print('***********************************')
            break
        elif distance_ans == "2":
            print('**********************************')
            distance_type = 'canberra'
            print('******Distance type canberra******')
            print('**********************************')
            break
        elif distance_ans == "3":
            print('***********************************')
            distance_type = 'cityblock'
            print('******Distance type cityblock******')
            print('***********************************')
            break
        elif distance_ans == "4":
            print('***********************************')
            distance_type = 'chebyshev'
            print('******Distance type chebyshev******')
            print('***********************************')
            break
        elif distance_ans == "5":
            print('***********************************')
            print('******Tank You!!!******')
            print('***********************************')
            break
        elif distance_ans != "":
            print("\n Not Valid Choice Try again")

    while True:
        print("""
        1.Single
        2.Complete
        3.Average
        4.Ward
        5.Exit/Quit
        """)
        linkage_ans = input("Choose linkage type? ")
        if linkage_ans == "1":
            print('******************************')
            print('*****linkage type single******')
            print('******************************')
            print('******************************')
            print('***Computations starting...***')
            print('******************************')
            t, tree, k_labels, distance = compute_result(d_table, distance_type,
                                                         'single')

            try:
                silhouette_avg = silhouette_score(squareform(distance), k_labels, metric='precomputed')
                result = result.append(
                    {'knowledge_base': kb_name,
                     'Rule_count': len(d_table.index.values),
                     'Atribute_count': len(d_table.columns.values),
                     'Cluster_count': len(get_cluster_classes(tree)),
                     'Distance_messure': distance_type, 'Linkage_method': 'single',
                     'Largest_group_count': len(max(get_cluster_classes(tree).values(), key=len)),
                     'Smalest_group_count': len(min(get_cluster_classes(tree).values(), key=len)),
                     'Computation_time': t, 'silhouette_score': silhouette_avg}, ignore_index=True)

            except:
                result = result.append(
                    {'knowledge_base': kb_name,
                     'Rule_count': len(d_table.index.values),
                     'Atribute_count': len(d_table.columns.values),
                     'Cluster_count': len(get_cluster_classes(tree)),
                     'Distance_messure': distance_type, 'Linkage_method': 'single',
                     'Largest_group_count': len(max(get_cluster_classes(tree).values(), key=len)),
                     'Smalest_group_count': len(min(get_cluster_classes(tree).values(), key=len)),
                     'Computation_time': t, 'silhouette_score': None}, ignore_index=True)
            break
        elif linkage_ans == "2":
            print('******************************')
            print('*****linkage type complete****')
            print('******************************')
            print('***Computations starting...***')
            print('******************************')
            t, tree, k_labels, distance = compute_result(d_table, distance_type,
                                                         'complete')

            try:
                silhouette_avg = silhouette_score(squareform(distance), k_labels, metric='precomputed')

                result = result.append(
                    {'knowledge_base': kb_name,
                     'Rule_count': len(d_table.index.values),
                     'Atribute_count': len(d_table.columns.values),
                     'Cluster_count': len(get_cluster_classes(tree)),
                     'Distance_messure': distance_type, 'Linkage_method': 'complete',
                     'Largest_group_count': len(max(get_cluster_classes(tree).values(), key=len)),
                     'Smalest_group_count': len(min(get_cluster_classes(tree).values(), key=len)),
                     'Computation_time': t, 'silhouette_score': silhouette_avg}, ignore_index=True)
            except:
                result = result.append(
                    {'knowledge_base': kb_name,
                     'Rule_count': len(d_table.index.values),
                     'Atribute_count': len(d_table.columns.values),
                     'Cluster_count': len(get_cluster_classes(tree)),
                     'Distance_messure': distance_type, 'Linkage_method': 'complete',
                     'Largest_group_count': len(max(get_cluster_classes(tree).values(), key=len)),
                     'Smalest_group_count': len(min(get_cluster_classes(tree).values(), key=len)),
                     'Computation_time': t, 'silhouette_score': None}, ignore_index=True)
            break
        elif linkage_ans == "3":
            print('******************************')
            print('*****linkage type average******')
            print('******************************')
            print('******************************')
            print('***Computations starting...***')
            print('******************************')
            t, tree, k_labels, distance = compute_result(d_table, distance_type,
                                                         'average')
            try:
                silhouette_avg = silhouette_score(squareform(distance), k_labels, metric='precomputed')
                result = result.append(
                    {'knowledge_base': kb_name,
                     'Rule_count': len(d_table.index.values),
                     'Atribute_count': len(d_table.columns.values),
                     'Cluster_count': len(get_cluster_classes(tree)),
                     'Distance_messure': distance_type, 'Linkage_method': 'average',
                     'Largest_group_count': len(max(get_cluster_classes(tree).values(), key=len)),
                     'Smalest_group_count': len(min(get_cluster_classes(tree).values(), key=len)),
                     'Computation_time': t, 'silhouette_score': silhouette_avg}, ignore_index=True)
            except:
                result = result.append(
                    {'knowledge_base': kb_name,
                     'Rule_count': len(d_table.index.values),
                     'Atribute_count': len(d_table.columns.values),
                     'Cluster_count': len(get_cluster_classes(tree)),
                     'Distance_messure': distance_type, 'Linkage_method': 'average',
                     'Largest_group_count': len(max(get_cluster_classes(tree).values(), key=len)),
                     'Smalest_group_count': len(min(get_cluster_classes(tree).values(), key=len)),
                     'Computation_time': t, 'silhouette_score': None}, ignore_index=True)
            break
        elif linkage_ans == "4":
            print('******************************')
            linkage_type = 'ward'
            print('*****linkage type ward******')
            print('******************************')
            print('******************************')
            print('***Computations starting...***')
            print('******************************')
            t, tree, k_labels, distance = compute_result(d_table, distance_type,
                                                         'ward')
            try:
                silhouette_avg = silhouette_score(squareform(distance), k_labels, metric='precomputed')
                result = result.append(
                    {'knowledge_base': kb_name,
                     'Rule_count': len(d_table.index.values),
                     'Atribute_count': len(d_table.columns.values),
                     'Cluster_count': len(get_cluster_classes(tree)),
                     'Distance_messure': distance_type, 'Linkage_method': 'ward',
                     'Largest_group_count': len(max(get_cluster_classes(tree).values(), key=len)),
                     'Smalest_group_count': len(min(get_cluster_classes(tree).values(), key=len)),
                     'Computation_time': t, 'silhouette_score': silhouette_avg}, ignore_index=True)
            except:
                result = result.append(
                    {'knowledge_base': kb_name,
                     'Rule_count': len(d_table.index.values),
                     'Atribute_count': len(d_table.columns.values),
                     'Cluster_count': len(get_cluster_classes(tree)),
                     'Distance_messure': distance_type, 'Linkage_method': 'ward',
                     'Largest_group_count': len(max(get_cluster_classes(tree).values(), key=len)),
                     'Smalest_group_count': len(min(get_cluster_classes(tree).values(), key=len)),
                     'Computation_time': t, 'silhouette_score': None}, ignore_index=True)
            break
        elif linkage_ans == "5":
            print('***********************************')
            print('******Tank You!!!******')
            print('***********************************')
            break
        elif linkage_ans != "":
            print("\n Not Valid Choice Try again")
    print("do you want continue tests?")
    print("""
    1.Yes
    2.No
    """)
    ans = input("Choose option:")
    if ans == "1":
        continue
    if ans == "2":
        break
result.to_csv(f'{kb_name}.csv')
result_k = init_result_df()

while True:
    while True:
        print("""
        1.Euclidean
        2.Canberra
        3.Manhattan
        4.Chebyshev
        5.Exit/Quit
        """)
        distance_ans = input("Choose distance measure:")
        if distance_ans == "1":
            print('***********************************')
            distance_type = 'euclidean'
            print('******Distance type euclidean******')
            print('***********************************')
            break
        elif distance_ans == "2":
            print('**********************************')
            distance_type = 'canberra'
            print('******Distance type canberra******')
            print('**********************************')
            break
        elif distance_ans == "3":
            print('***********************************')
            distance_type = 'cityblock'
            print('******Distance type cityblock******')
            print('***********************************')
            break
        elif distance_ans == "4":
            print('***********************************')
            distance_type = 'chebyshev'
            print('******Distance type chebyshev******')
            print('***********************************')
            break
        elif distance_ans == "5":
            print('***********************************')
            print('******Tank You!!!******')
            print('***********************************')
            break
        elif distance_ans != "":
            print("\n Not Valid Choice Try again")

    while True:
        print("""
        1.Single
        2.Complete
        3.Average
        4.Ward
        5.Exit/Quit
        """)
        linkage_ans = input("Choose linkage type? ")
        if linkage_ans == "1":
            print('******************************')
            print('*****linkage type single******')
            print('******************************')
            print('******************************')
            print('***Computations starting...***')
            print('******************************')
            for i in range(len(d_table.index.values)):
                k1 = round(math.sqrt(len(d_table.index.values)) + ((i + 1) * r_n(len(d_table.index.values))))
                k2 = round(math.sqrt(len(d_table.index.values)) - ((i + 1) * r_n(len(d_table.index.values))))
                if k2 <= 2 or k1 >= len(d_table.index.values):
                    break
                t1, tree1, k_labels1, distance1 = compute_result_k(d_table, distance_type,
                                                                   'single', k1)
                t2, tree2, k_labels2, distance2 = compute_result_k(d_table, distance_type,
                                                                   'single', k2)
                print(f'k1: {k1}: {k_labels1}')
                print(f'k2: {k2}: {k_labels2}')
                try:
                    silhouette_avg_1 = silhouette_score(squareform(distance1), k_labels1, metric='precomputed')
                    silhouette_avg_2 = silhouette_score(squareform(distance2), k_labels2, metric='precomputed')
                    print(silhouette_avg_1)
                    print(silhouette_avg_2)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k1,
                         'Distance_messure': distance_type, 'Linkage_method': 'single',
                         'Largest_group_count': Counter(k_labels1).get(
                             max(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Smalest_group_count':
                             Counter(k_labels1).get(min(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Computation_time': t1, 'silhouette_score': silhouette_avg_1}, ignore_index=True)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k2,
                         'Distance_messure': distance_type, 'Linkage_method': 'single',
                         'Largest_group_count':
                             Counter(k_labels2).get(
                                 max(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Smalest_group_count':
                             Counter(k_labels2).get(
                                 min(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Computation_time': t2, 'silhouette_score': silhouette_avg_2}, ignore_index=True)
                except:
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k1,
                         'Distance_messure': distance_type, 'Linkage_method': 'single',
                         'Largest_group_count': Counter(k_labels1).get(
                             max(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Smalest_group_count':
                             Counter(k_labels1).get(min(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Computation_time': t1, 'silhouette_score': None}, ignore_index=True)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k2,
                         'Distance_messure': distance_type, 'Linkage_method': 'single',
                         'Largest_group_count':
                             Counter(k_labels2).get(
                                 max(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Smalest_group_count':
                             Counter(k_labels2).get(
                                 min(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Computation_time': t2, 'silhouette_score': None}, ignore_index=True)
            break
        elif linkage_ans == "2":
            print('******************************')
            print('*****linkage type complete****')
            print('******************************')
            print('***Computations starting...***')
            print('******************************')
            for i in range(len(d_table.index.values)):
                k1 = round(math.sqrt(len(d_table.index.values)) + ((i + 1) * r_n(len(d_table.index.values))))
                k2 = round(math.sqrt(len(d_table.index.values)) - ((i + 1) * r_n(len(d_table.index.values))))
                if k2 <= 2 or k1 >= len(d_table.index.values):
                    break
                t1, tree1, k_labels1, distance1 = compute_result_k(d_table, distance_type,
                                                                   'complete', k1)
                t2, tree2, k_labels2, distance2 = compute_result_k(d_table, distance_type,
                                                                   'complete', k2)
                print(f'k1: {k1}: {k_labels1}')
                print(f'k2: {k2}: {k_labels2}')
                try:
                    silhouette_avg_1 = silhouette_score(squareform(distance1), k_labels1, metric='precomputed')
                    silhouette_avg_2 = silhouette_score(squareform(distance2), k_labels2, metric='precomputed')
                    print(silhouette_avg_1)
                    print(silhouette_avg_2)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k1,
                         'Distance_messure': distance_type, 'Linkage_method': 'complete',
                         'Largest_group_count': Counter(k_labels1).get(
                             max(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Smalest_group_count':
                             Counter(k_labels1).get(min(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Computation_time': t1, 'silhouette_score': silhouette_avg_1}, ignore_index=True)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k2,
                         'Distance_messure': distance_type, 'Linkage_method': 'complete',
                         'Largest_group_count':
                             Counter(k_labels2).get(
                                 max(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Smalest_group_count':
                             Counter(k_labels2).get(
                                 min(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Computation_time': t2, 'silhouette_score': silhouette_avg_2}, ignore_index=True)
                except:
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k1,
                         'Distance_messure': distance_type, 'Linkage_method': 'complete',
                         'Largest_group_count': Counter(k_labels1).get(
                             max(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Smalest_group_count':
                             Counter(k_labels1).get(min(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Computation_time': t1, 'silhouette_score': None}, ignore_index=True)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k2,
                         'Distance_messure': distance_type, 'Linkage_method': 'complete',
                         'Largest_group_count':
                             Counter(k_labels2).get(
                                 max(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Smalest_group_count':
                             Counter(k_labels2).get(
                                 min(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Computation_time': t2, 'silhouette_score': None}, ignore_index=True)
            break
        elif linkage_ans == "3":
            print('******************************')
            print('*****linkage type average******')
            print('******************************')
            print('******************************')
            print('***Computations starting...***')
            print('******************************')
            for i in range(len(d_table.index.values)):
                k1 = round(math.sqrt(len(d_table.index.values)) + ((i + 1) * r_n(len(d_table.index.values))))
                k2 = round(math.sqrt(len(d_table.index.values)) - ((i + 1) * r_n(len(d_table.index.values))))
                if k2 <= 2 or k1 >= len(d_table.index.values):
                    break
                t1, tree1, k_labels1, distance1 = compute_result_k(d_table, distance_type,
                                                                   'average', k1)
                t2, tree2, k_labels2, distance2 = compute_result_k(d_table, distance_type,
                                                                   'average', k2)
                print(f'k1: {k1}: {k_labels1}')
                print(f'k2: {k2}: {k_labels2}')
                try:
                    silhouette_avg_1 = silhouette_score(squareform(distance1), k_labels1, metric='precomputed')
                    silhouette_avg_2 = silhouette_score(squareform(distance2), k_labels2, metric='precomputed')
                    print(silhouette_avg_1)
                    print(silhouette_avg_2)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k1,
                         'Distance_messure': distance_type, 'Linkage_method': 'average',
                         'Largest_group_count': Counter(k_labels1).get(
                             max(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Smalest_group_count':
                             Counter(k_labels1).get(min(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Computation_time': t1, 'silhouette_score': silhouette_avg_1}, ignore_index=True)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k2,
                         'Distance_messure': distance_type, 'Linkage_method': 'average',
                         'Largest_group_count':
                             Counter(k_labels2).get(
                                 max(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Smalest_group_count':
                             Counter(k_labels2).get(
                                 min(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Computation_time': t2, 'silhouette_score': silhouette_avg_2}, ignore_index=True)
                except:
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k1,
                         'Distance_messure': distance_type, 'Linkage_method': 'average',
                         'Largest_group_count': Counter(k_labels1).get(
                             max(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Smalest_group_count':
                             Counter(k_labels1).get(min(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Computation_time': t1, 'silhouette_score': None}, ignore_index=True)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k2,
                         'Distance_messure': distance_type, 'Linkage_method': 'average',
                         'Largest_group_count':
                             Counter(k_labels2).get(
                                 max(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Smalest_group_count':
                             Counter(k_labels2).get(
                                 min(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Computation_time': t2, 'silhouette_score': None}, ignore_index=True)
            break
        elif linkage_ans == "4":
            print('******************************')
            linkage_type = 'ward'
            print('*****linkage type ward******')
            print('******************************')
            print('******************************')
            print('***Computations starting...***')
            print('******************************')
            for i in range(len(d_table.index.values)):
                k1 = round(math.sqrt(len(d_table.index.values)) + ((i + 1) * r_n(len(d_table.index.values))))
                k2 = round(math.sqrt(len(d_table.index.values)) - ((i + 1) * r_n(len(d_table.index.values))))
                if k2 <= 2 or k1 >= len(d_table.index.values):
                    break
                t1, tree1, k_labels1, distance1 = compute_result_k(d_table, distance_type,
                                                                   'ward', k1)
                t2, tree2, k_labels2, distance2 = compute_result_k(d_table, distance_type,
                                                                   'ward', k2)
                print(f'k1: {k1}: {k_labels1}')
                print(f'k2: {k2}: {k_labels2}')
                try:
                    silhouette_avg_1 = silhouette_score(squareform(distance1), k_labels1, metric='precomputed')
                    silhouette_avg_2 = silhouette_score(squareform(distance2), k_labels2, metric='precomputed')
                    print(silhouette_avg_1)
                    print(silhouette_avg_2)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k1,
                         'Distance_messure': distance_type, 'Linkage_method': 'ward',
                         'Largest_group_count': Counter(k_labels1).get(
                             max(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Smalest_group_count':
                             Counter(k_labels1).get(min(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Computation_time': t1, 'silhouette_score': silhouette_avg_1}, ignore_index=True)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k2,
                         'Distance_messure': distance_type, 'Linkage_method': 'ward',
                         'Largest_group_count':
                             Counter(k_labels2).get(
                                 max(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Smalest_group_count':
                             Counter(k_labels2).get(
                                 min(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Computation_time': t2, 'silhouette_score': silhouette_avg_2}, ignore_index=True)
                except:
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k1,
                         'Distance_messure': distance_type, 'Linkage_method': 'ward',
                         'Largest_group_count': Counter(k_labels1).get(
                             max(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Smalest_group_count':
                             Counter(k_labels1).get(min(Counter(k_labels1), key=Counter(k_labels1).get)),
                         'Computation_time': t1, 'silhouette_score': None}, ignore_index=True)
                    result_k = result_k.append(
                        {'knowledge_base': kb_name,
                         'Rule_count': len(d_table.index.values),
                         'Atribute_count': len(d_table.columns.values),
                         'Cluster_count': k2,
                         'Distance_messure': distance_type, 'Linkage_method': 'ward',
                         'Largest_group_count':
                             Counter(k_labels2).get(
                                 max(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Smalest_group_count':
                             Counter(k_labels2).get(
                                 min(Counter(k_labels2), key=Counter(k_labels2).get)),
                         'Computation_time': t2, 'silhouette_score': None}, ignore_index=True)
            break
        elif linkage_ans == "5":
            print('***********************************')
            print('******Tank You!!!******')
            print('***********************************')
            break
        elif linkage_ans != "":
            print("\n Not Valid Choice Try again")
    print("do you want continue tests?")
    print("""
    1.Yes
    2.No
    """)
    ans = input("Choose option:")
    if ans == "1":
        continue
    if ans == "2":
        break

result_k = result_k.set_index('knowledge_base')
result_k.to_csv(f'tests_with_k/{kb_name}_with_k.csv')
