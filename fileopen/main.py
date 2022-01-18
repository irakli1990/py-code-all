from tkinter import *
from tkinter import filedialog

root = Tk()

root.filename = filedialog.askopenfilename(initialdir="c:/", title="select a file", filetypes=(("xml files", "*.xml"), ("all files", "*.*")))

if __name__ == '__main__':
    root.mainloop()
