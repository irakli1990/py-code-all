#!/usr/bin/env python
# coding: utf-8

# In[3]:


import xml.etree.ElementTree as et
import numpy as np
import pandas as pd
import qgrid
from scipy.spatial import distance_matrix
from sklearn import preprocessing
from scipy.cluster.hierarchy import ClusterWarning
import scipy.cluster
from scipy.cluster.hierarchy import dendrogram

from scipy.cluster import hierarchy
import matplotlib.pyplot as plt
from warnings import simplefilter

from sklearn.cluster import AgglomerativeClustering

simplefilter("ignore", ClusterWarning)

label_encoder = preprocessing.LabelEncoder()


# In[4]:


def get_root_of_xml():
    etree = et.parse('data.xml')
    return etree.getroot()


# In[5]:


def get_rules_attrs(xml_root):
    rule_attr_list = [xml.attrib for xml in xml_root.iter('rule')]
    rule_attr_dict = rule_attr_list.copy()
    rule_attr_data_frame = pd.DataFrame(list(rule_attr_dict))
    return rule_attr_data_frame


# In[6]:


def get_attribute_attrs(xml_root):
    attribute_attr_list = [a.attrib for a in xml_root.find('attributes').iter('name')]
    attribute_attr_dict = attribute_attr_list.copy()
    attributes_attr_data_frame = pd.DataFrame(list(attribute_attr_dict))
    attributes_attr_data_frame.drop('valueID', axis='columns', inplace=True)
    attributes_attr_data_frame.dropna(subset=['attributeID'], inplace=True)
    return attributes_attr_data_frame


# In[7]:


def init_rule_matrix(rule_data_frame, attribute_data_frame):
    for x in attribute_data_frame.values:
        rule_data_frame['attribute_' + x] = np.nan
    return rule_data_frame


# In[8]:


def get_rule_by_id(xml_root, id_rule):
    for rule in xml_root.iter('rule'):
        if rule.attrib['ruleID'] == id_rule:
            return rule


# In[9]:


def populate_matrix_with_conditions(xml_root, data_frame):
    for i in range(len(list(data_frame.ruleID))):
        for k in list(get_rule_by_id(xml_root, data_frame.ruleID[i]).find('conditions')):
            data_frame.loc[
                data_frame['ruleID'] == data_frame.ruleID[i], str(
                    'attribute_' + list(k)[0].attrib['attributeID'])] = list(k)[2].text
    return data_frame


# In[10]:


def populate_matrix_with_conclusions(xml_root, data_frame):
    for i in range(len(list(data_frame.ruleID))):
        for k in list(get_rule_by_id(xml_root, data_frame.ruleID[i]).find('conclusion')):
            data_frame.loc[
                data_frame['ruleID'] == data_frame.ruleID[i], str(
                    'attribute_' + list(k)[0].attrib['attributeID'])] = list(k)[2].text
    return data_frame


# In[11]:


def encode_categorical_values(data_frame):
    current_column = None
    try:
        for col in data_frame.columns:
            current_column = col
            data_frame[current_column] = pd.to_numeric(data_frame[current_column], downcast="float")
            scalar = preprocessing.MinMaxScaler()
            # data_frame[current_column] = scalar.fit_transform(data_frame[current_column])
            print(data_frame[current_column])
    except:
        data_frame[current_column] = label_encoder.fit_transform(data_frame[current_column].astype(str))
        encode_categorical_values(data_frame)


# In[12]:


def get_simbolic_values(xml_root):
    xml_root.find()


# In[13]:


def plot_dendrogram(model, **kwargs):
    counts = np.zeros(model.children_.shape[0])
    n_samples = len(model.labels_)
    for i, merge in enumerate(model.children_):
        current_count = 0
        for child_idx in merge:
            if child_idx < n_samples:
                current_count += 1
            else:
                current_count += counts[child_idx - n_samples]
        counts[i] = current_count

    linkage_matrix = np.column_stack([model.children_, model.distances_,
                                      counts]).astype(float)
    dendrogram(linkage_matrix, **kwargs)


# In[14]:


if __name__ == '__main__':
    root = get_root_of_xml()
    rule_attrs = get_rules_attrs(root)
    attribute_attrs = get_attribute_attrs(root)
    init_data = init_rule_matrix(rule_attrs, attribute_attrs)

    populate_matrix_with_conditions(root, init_data)
    # widget = qgrid.show_grid(populate_matrix_with_conclusions(root, init_data), show_toolbar=True)
#
# # In[15]:
#
#
# widget
#
# # In[ ]:
#
#
# data = populate_matrix_with_conclusions(root, init_data)
# encode_categorical_values(data)
#
# # In[ ]:
#
#
# widget = qgrid.show_grid(data, show_toolbar=True)
#
# # In[ ]:
#
#
# widget
#
# # In[ ]:
#
#
# data.fillna(float(0))
#
# # In[ ]:
#
#
# data.to_csv('outout.csv')
#
# # In[ ]:
#
#
# columns = list(data.columns)
#
# # In[ ]:
#
#
# columns
#
# # In[ ]:
#
#
# del columns[0], columns[0]
#
# # In[ ]:
#
#
# columns
#
# # In[ ]:
#
#
# indexed_data = data.set_index(data.ruleID)
#
# # In[ ]:
#
#
# clean_data = indexed_data.fillna(0)
#
# # In[ ]:
#
#
# clean_data.pop('number')
#
# # In[ ]:
#
#
# clean_data.pop('ruleID')
#
# # In[ ]:
#
#
# # clean_data.to_csv('clean.csv')
# clean_data
#
# # In[ ]:
#
#
# distance_mat = pd.DataFrame(distance_matrix(clean_data.to_numpy(), clean_data.to_numpy()), index=indexed_data.index,
#                             columns=indexed_data.index)
#
# # In[ ]:
#
#
# distance_mat
#
# # In[ ]:
#
#
# clusters = scipy.cluster.hierarchy.linkage(distance_mat.to_numpy(), method='complete')
#
# # In[ ]:
#
#
# clusters
#
# # In[ ]:
#
#
# plt.figure(figsize=(10, 10))
# dn = hierarchy.dendrogram(clusters)
#
# # In[ ]:
#
#
# plt.show()
