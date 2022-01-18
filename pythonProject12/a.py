#!/usr/bin/env python
# coding: utf-8

# In[62]:

from tkinter import *
from tkinter import ttk
from scipy import cluster
from scipy import spatial
from sklearn import metrics
from sklearn import preprocessing
from warnings import simplefilter
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import ward, single, complete, average, leaves_list
from scipy.spatial.distance import squareform, pdist
from yellowbrick.cluster import silhouette_visualizer
import xml.etree.ElementTree as et
import tkinter.filedialog

import math
import time

import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# In[63]:


simplefilter("ignore", cluster.hierarchy.ClusterWarning)
encoder = preprocessing.LabelEncoder()
scalar = preprocessing.MinMaxScaler()


# In[64]:


def select_knowledge_base():
    etree = et.parse(tkinter.filedialog.askopenfilename())
    return etree.getroot()


# In[65]:


def select_knowledge_base_rules(knowledge_base):
    rule_attr_list = [xml.attrib for xml in knowledge_base.iter('rule')]
    rule_attr_dict = rule_attr_list.copy()
    rule_attr_data_frame = pd.DataFrame(list(rule_attr_dict))
    return rule_attr_data_frame


# In[66]:


def select_knowledge_base_attributes(knowledge_base):
    attribute_attr_list = [a.attrib for a in knowledge_base.find('attributes').iter('name')]
    attribute_attr_dict = attribute_attr_list.copy()
    attributes_attr_data_frame = pd.DataFrame(list(attribute_attr_dict))
    attributes_attr_data_frame.drop('valueID', axis='columns', inplace=True)
    attributes_attr_data_frame.dropna(subset=['attributeID'], inplace=True)
    return attributes_attr_data_frame


# In[67]:


def init_rule_matrix(rule_data_frame, attribute_data_frame):
    for x in attribute_data_frame.values:
        rule_data_frame['attr_' + x] = np.nan
    return rule_data_frame


# In[68]:


def get_rule_by_id(xml_root, id_rule):
    for rule in xml_root.iter('rule'):
        if rule.attrib['ruleID'] == id_rule:
            return rule


# In[69]:


def populate_matrix_with_conditions(knowledge_base, data_frame):
    for i in range(len(list(data_frame.ruleID))):
        for k in list(get_rule_by_id(knowledge_base, data_frame.ruleID[i]).find('conditions')):
            data_frame.loc[
                data_frame['ruleID'] == data_frame.ruleID[i], str(
                    'attr_' + list(k)[0].attrib['attributeID'])] = list(k)[2].text
    return data_frame


# In[70]:


def populate_matrix_with_conclusions(knowledge_base, data_frame):
    for i in range(len(list(data_frame.ruleID))):
        for k in list(get_rule_by_id(knowledge_base, data_frame.ruleID[i]).find('conclusion')):
            data_frame.loc[
                data_frame['ruleID'] == data_frame.ruleID[i], str(
                    'attr_' + list(k)[0].attrib['attributeID'])] = list(k)[2].text
    return data_frame


# In[71]:


def get_simbolic_values(knowledge_base):
    symbolic_value = []
    t = [a for a in knowledge_base.find('attributes').iter('symbolic_value')]
    for x in range(len(list(t))):
        symbolic_value.append(list(t)[x].find('name').text)
    return set(symbolic_value)


# In[72]:


def normilize_types_of_column_values(data_frame, column):
    try:
        data_frame[column] = pd.to_numeric(data_frame[column], downcast="float")
    except:
        data_frame[column] = data_frame[column].astype(str)


# In[73]:


def isNan(x):
    return x != x


# In[74]:


"""Read Knowledge base"""
knowledge_base = select_knowledge_base()

# In[75]:


"""Read Knowledge base rules"""
knowledge_base_rules = select_knowledge_base_rules(knowledge_base)

# In[76]:


knowledge_base_rules

# In[77]:


"""Read knowledge base attributes"""
knowledge_base_attributes = select_knowledge_base_attributes(knowledge_base)

# In[78]:


knowledge_base_attributes

# In[79]:


"""Initialize data frame"""
init_data = init_rule_matrix(knowledge_base_rules, knowledge_base_attributes)

# In[80]:


init_data

# In[81]:


"""populate data frame with conditions"""
populate_matrix_with_conditions(knowledge_base, init_data)

# In[82]:


"""populate data frame with conditions"""
populate_matrix_with_conclusions(knowledge_base, init_data)

# In[83]:


"""Set index to data"""
indexed_data = init_data.set_index('ruleID')

# In[84]:


indexed_data

# In[85]:


"""Remove number column from data frame"""
if 'number' in indexed_data:
    indexed_data.drop('number', axis=1, inplace=True)

# In[86]:


indexed_data

# In[87]:


indexed_data.fillna('*')

# In[88]:


for column in indexed_data.columns:
    column_values = indexed_data[column][isNan(indexed_data[column]) == False].values
    print(column_values)
    print(sorted(set(column_values)))
    for i in sorted(set(column_values)):
        indexed_data.loc[indexed_data[column] == i, column] = sorted(set(column_values)).index(i) + 1

# In[89]:


indexed_data = indexed_data.fillna(0)
indexed_data.to_csv('b.csv')

# In[90]:


indexed_data = indexed_data.apply(pd.to_numeric)

# In[91]:


indexed_data.to_csv('c.csv')

# In[92]:


indexed_data

# In[94]:


distance_loop = True
linkage_loop = True
distance_type = ''
linkage_type = ''
distance_ans = ''
linkage_ans = ''
while distance_loop:
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

while linkage_loop:
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
        try:
            diff, dendro, silhouette_score = compiute_result(indexed_data, distance_type=distance_type,
                                                             linkage_type='single')
            result = result.append(
                {'knowledge_base': knowledge_base.attrib.get('kbName'), 'Rule_count': len(indexed_data.index.values),
                 'Atribute_count': len(indexed_data.columns.values), 'Cluster_count': len(get_cluster_classes(dendro)),
                 'Distance_messure': distance_type, 'Linkage_method': linkage_type,
                 'Largest_group_count': len(max(get_cluster_classes(dendro).values(), key=len)),
                 'Smalest_group_count': len(min(get_cluster_classes(dendro).values(), key=len)),
                 'Computation_time': diff, 'silhouette_score': silhouette_score}, ignore_index=True)
        except:
            result = result.append(
                {'knowledge_base': knowledge_base.attrib.get('kbName'), 'Rule_count': len(indexed_data.index.values),
                 'Atribute_count': len(indexed_data.columns.values), 'Cluster_count': len(get_cluster_classes(dendro)),
                 'Distance_messure': distance_type, 'Linkage_method': linkage_type,
                 'Largest_group_count': len(max(get_cluster_classes(dendro).values(), key=len)),
                 'Smalest_group_count': len(min(get_cluster_classes(dendro).values(), key=len)),
                 'Computation_time': diff, 'silhouette_score': None}, ignore_index=True)
        break
    elif linkage_ans == "2":
        print('******************************')
        linkage_type = 'complete'
        print('*****linkage type complete******')
        print('******************************')
        print('******************************')
        print('***Computations starting...***')
        print('******************************')
        try:
            diff, dendro, silhouette_score = compiute_result(indexed_data, distance_type=distance_type,
                                                             linkage_type='complete')
            result = result.append(
                {'knowledge_base': knowledge_base.attrib.get('kbName'), 'Rule_count': len(indexed_data.index.values),
                 'Atribute_count': len(indexed_data.columns.values), 'Cluster_count': len(get_cluster_classes(dendro)),
                 'Distance_messure': distance_type, 'Linkage_method': linkage_type,
                 'Largest_group_count': len(max(get_cluster_classes(dendro).values(), key=len)),
                 'Smalest_group_count': len(min(get_cluster_classes(dendro).values(), key=len)),
                 'Computation_time': diff, 'silhouette_score': silhouette_score}, ignore_index=True)
        except:
            result = result.append(
                {'knowledge_base': knowledge_base.attrib.get('kbName'), 'Rule_count': len(indexed_data.index.values),
                 'Atribute_count': len(indexed_data.columns.values), 'Cluster_count': len(get_cluster_classes(dendro)),
                 'Distance_messure': distance_type, 'Linkage_method': linkage_type,
                 'Largest_group_count': len(max(get_cluster_classes(dendro).values(), key=len)),
                 'Smalest_group_count': len(min(get_cluster_classes(dendro).values(), key=len)),
                 'Computation_time': diff, 'silhouette_score': None}, ignore_index=True)
        break
    elif linkage_ans == "3":
        print('******************************')
        print('*****linkage type average******')
        print('******************************')
        print('******************************')
        print('***Computations starting...***')
        print('******************************')
        try:
            diff, dendro, silhouette_score = compiute_result(indexed_data, distance_type=distance_type,
                                                             linkage_type='average')
            result = result.append(
                {'knowledge_base': knowledge_base.attrib.get('kbName'), 'Rule_count': len(indexed_data.index.values),
                 'Atribute_count': len(indexed_data.columns.values), 'Cluster_count': len(get_cluster_classes(dendro)),
                 'Distance_messure': distance_type, 'Linkage_method': linkage_type,
                 'Largest_group_count': len(max(get_cluster_classes(dendro).values(), key=len)),
                 'Smalest_group_count': len(min(get_cluster_classes(dendro).values(), key=len)),
                 'Computation_time': diff, 'silhouette_score': silhouette_score}, ignore_index=True)
        except:
            result = result.append(
                {'knowledge_base': knowledge_base.attrib.get('kbName'), 'Rule_count': len(indexed_data.index.values),
                 'Atribute_count': len(indexed_data.columns.values), 'Cluster_count': len(get_cluster_classes(dendro)),
                 'Distance_messure': distance_type, 'Linkage_method': linkage_type,
                 'Largest_group_count': len(max(get_cluster_classes(dendro).values(), key=len)),
                 'Smalest_group_count': len(min(get_cluster_classes(dendro).values(), key=len)),
                 'Computation_time': diff, 'silhouette_score': None}, ignore_index=True)
        break
    elif linkage_ans == "4":
        print('******************************')
        linkage_type = 'ward'
        print('*****linkage type ward******')
        print('******************************')
        print('******************************')
        print('***Computations starting...***')
        print('******************************')
        try:
            diff, dendro, silhouette_score = compiute_result(indexed_data, distance_type=distance_type,
                                                             linkage_type='average')
            result = result.append(
                {'knowledge_base': knowledge_base.attrib.get('kbName'), 'Rule_count': len(indexed_data.index.values),
                 'Atribute_count': len(indexed_data.columns.values), 'Cluster_count': len(get_cluster_classes(dendro)),
                 'Distance_messure': distance_type, 'Linkage_method': linkage_type,
                 'Largest_group_count': len(max(get_cluster_classes(dendro).values(), key=len)),
                 'Smalest_group_count': len(min(get_cluster_classes(dendro).values(), key=len)),
                 'Computation_time': diff, 'silhouette_score': silhouette_score}, ignore_index=True)
        except:
            result = result.append(
                {'knowledge_base': knowledge_base.attrib.get('kbName'), 'Rule_count': len(indexed_data.index.values),
                 'Atribute_count': len(indexed_data.columns.values), 'Cluster_count': len(get_cluster_classes(dendro)),
                 'Distance_messure': distance_type, 'Linkage_method': linkage_type,
                 'Largest_group_count': len(max(get_cluster_classes(dendro).values(), key=len)),
                 'Smalest_group_count': len(min(get_cluster_classes(dendro).values(), key=len)),
                 'Computation_time': diff, 'silhouette_score': None}, ignore_index=True)
        break
    elif linkage_ans == "5":
        print('***********************************')
        print('******Tank You!!!******')
        print('***********************************')
        break
    elif linkage_ans != "":
        print("\n Not Valid Choice Try again")

# In[ ]:
