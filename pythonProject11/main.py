#!/usr/bin/env python
# coding: utf-8

# In[2]:

import tkinter.filedialog

import xml.etree.ElementTree as et
import numpy as np
import pandas as pd

import scipy.cluster
from scipy.cluster.hierarchy import dendrogram
from scipy.cluster.hierarchy import ClusterWarning
from scipy.spatial import distance_matrix
from scipy.cluster import hierarchy

from sklearn import preprocessing
from sklearn.metrics import silhouette_score
from sklearn.metrics import silhouette_samples
from sklearn.cluster import AgglomerativeClustering

import gower
import qgrid

import matplotlib.pyplot as plt
from warnings import simplefilter

simplefilter("ignore", ClusterWarning)

label_encoder = preprocessing.LabelEncoder()
scalar = preprocessing.MinMaxScaler()


# In[3]:


def get_root_of_xml():
    etree = et.parse(tkinter.filedialog.askopenfilename())
    return etree.getroot()


# In[4]:


def get_rules_attrs(xml_root):
    rule_attr_list = [xml.attrib for xml in xml_root.iter('rule')]
    rule_attr_dict = rule_attr_list.copy()
    rule_attr_data_frame = pd.DataFrame(list(rule_attr_dict))
    return rule_attr_data_frame


# In[5]:


def get_attribute_attrs(xml_root):
    attribute_attr_list = [a.attrib for a in xml_root.find('attributes').iter('name')]
    attribute_attr_dict = attribute_attr_list.copy()
    attributes_attr_data_frame = pd.DataFrame(list(attribute_attr_dict))
    attributes_attr_data_frame.drop('valueID', axis='columns', inplace=True)
    attributes_attr_data_frame.dropna(subset=['attributeID'], inplace=True)
    return attributes_attr_data_frame


# In[6]:


def init_rule_matrix(rule_data_frame, attribute_data_frame):
    for x in attribute_data_frame.values:
        rule_data_frame['attribute_' + x] = np.nan
    return rule_data_frame


# In[7]:


def get_rule_by_id(xml_root, id_rule):
    for rule in xml_root.iter('rule'):
        if rule.attrib['ruleID'] == id_rule:
            return rule


# In[8]:


def populate_matrix_with_conditions(xml_root, data_frame):
    for i in range(len(list(data_frame.ruleID))):
        for k in list(get_rule_by_id(xml_root, data_frame.ruleID[i]).find('conditions')):
            data_frame.loc[
                data_frame['ruleID'] == data_frame.ruleID[i], str(
                    'attribute_' + list(k)[0].attrib['attributeID'])] = list(k)[2].text
    return data_frame


# In[9]:


def populate_matrix_with_conclusions(xml_root, data_frame):
    for i in range(len(list(data_frame.ruleID))):
        for k in list(get_rule_by_id(xml_root, data_frame.ruleID[i]).find('conclusion')):
            data_frame.loc[
                data_frame['ruleID'] == data_frame.ruleID[i], str(
                    'attribute_' + list(k)[0].attrib['attributeID'])] = list(k)[2].text
    return data_frame


# In[10]:


def normilize_types_of_column_values(data_frame, column):
    try:
        data_frame[column] = pd.to_numeric(data_frame[column], downcast="float")
    except:
        data_frame[column] = data_frame[column].astype(str)


# In[11]:


def get_simbolic_values(xml_root):
    symbolic_value = []
    t = [a for a in xml_root.find('attributes').iter('symbolic_value')]
    for x in range(len(list(t))):
        symbolic_value.append(list(t)[x].find('name').text)
    return set(symbolic_value)


# In[12]:


def plot_dendrogram(model, **kwargs):
    # Create linkage matrix and then plot the dendrogram

    # create the counts of samples under each node
    counts = np.zeros(model.children_.shape[0])
    n_samples = len(model.labels_)
    for i, merge in enumerate(model.children_):
        current_count = 0
        for child_idx in merge:
            if child_idx < n_samples:
                current_count += 1  # leaf node
            else:
                current_count += counts[child_idx - n_samples]
        counts[i] = current_count

    linkage_matrix = np.column_stack([model.children_, model.distances_,
                                      counts]).astype(float)

    # Plot the corresponding dendrogram
    dendrogram(linkage_matrix, **kwargs)


# In[48]:


if __name__ == '__main__':
    root = get_root_of_xml()
    symbolic_value = list(get_simbolic_values(root))
    print(symbolic_value)
    rule_attrs = get_rules_attrs(root)
    attribute_attrs = get_attribute_attrs(root)
    init_data = init_rule_matrix(rule_attrs, attribute_attrs)

    populate_matrix_with_conditions(root, init_data)
#     widget = qgrid.show_grid(populate_matrix_with_conclusions(root, init_data), show_toolbar=True)


# In[49]:


#     widget
for o in symbolic_value:
    print(symbolic_value.index(o))

# In[50]:


data = populate_matrix_with_conclusions(root, init_data)

# In[51]:


data

# In[52]:


data.drop(data.columns[[0]], axis=1, inplace=True)

# In[55]:


data

# In[57]:


g_data = data

# In[58]:


g_data.set_index('ruleID')

# In[59]:


gdistance = gower.gower_matrix(g_data)

# In[62]:


for g_linkage in ('single', 'complete', 'average', 'ward'):
    clusters = scipy.cluster.hierarchy.linkage(gdistance, method=g_linkage)
    plt.figure(figsize=(20, 10))
    dn = hierarchy.dendrogram(clusters)

# In[63]:


data.info()

# In[64]:


for column in data.columns:
    normilize_types_of_column_values(data, column)

# In[32]:


data.info()

# In[76]:


# encode_categorical_values(data)
columns = list(data.columns)

# In[77]:


columns

# In[78]:


numerical_columns = []
non_numerocal_columns = []
for col in columns:
    if np.issubdtype(data[col].dtype, np.number):
        numerical_columns.append(col)
    else:
        non_numerocal_columns.append(col)

# In[26]:


# data[numerical_columns] = data[numerical_columns].fillna(float(0))


# In[79]:


numerical_data = data[numerical_columns]

# In[80]:


numerical_data = numerical_data.fillna(float(0))

# In[81]:


numerical_data

# In[71]:


scalar.fit(numerical_data)

# In[72]:


x = scalar.transform(numerical_data)

# In[73]:


data[numerical_columns] = pd.DataFrame(x)

# In[74]:


data

# In[45]:


for s in symbolic_value:
    for categorical in non_numerocal_columns:
        data.loc[data[categorical] == s, categorical] = symbolic_value.index(s)

# In[46]:


for categorical in non_numerocal_columns:
    data.loc[data[categorical] == 'nan', categorical] = 8

# In[47]:


data

# In[43]:


indexed_data = data.set_index(data.ruleID)

# In[44]:


distance_mat = pd.DataFrame(distance_matrix(indexed_data.to_numpy(), indexed_data.to_numpy()), index=indexed_data.index,
                            columns=indexed_data.index)

# In[45]:


distance_mat

# In[70]:


# distance_mat


# In[87]:


for linkage in ('single', 'complete', 'average', 'ward'):
    model = AgglomerativeClustering(distance_threshold=0, n_clusters=None, linkage=linkage)
    model = model.fit(indexed_data)
    plt.figure(figsize=(20, 10))
    plt.title(f'Hierarchical Clustering Dendrogram - {linkage} linkage')
    plot_dendrogram(model)
    plt.xlabel("Number of points in node (or index of point if no parenthesis).")
    plt.show()

