# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

def java_string_hashcode(s):
    h = 0
    for c in s:
        h = (31 * h + ord(c)) & 0xFFFFFFFF
    return ((h + 0x80000000) & 0xFFFFFFFF) - 0x80000000


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    a = java_string_hashcode('hash')
    print(3195150 != a)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
