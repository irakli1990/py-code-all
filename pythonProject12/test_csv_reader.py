import glob
import pandas as pd

if __name__ == '__main__':
    # get data file names
    path = r'C:\Users\Irakli\PycharmProjects\pythonProject12\new_tests2'
    filenames = glob.glob(path + "/*.csv")

    dfs = []
    for filename in filenames:
        dfs.append(pd.read_csv(filename))

    # Concatenate all data into one DataFrame
    big_frame = pd.concat(dfs, ignore_index=True)

    big_frame = big_frame.set_index('knowledge_base')

big_frame.to_csv('experiments_summary.csv')