# This is a sample Python script.
from tkinter import *

# tkinter root
root = Tk()
root.title("Simple calculator")

entry = Entry(root, width=40, borderwidth=2)
entry.grid(row=0, column=0, columnspan=3, padx=10, pady=10)


def button_click(number):
    current = entry.get()
    entry.delete(0, END)
    entry.insert(0, str(current) + str(number))


def clear():
    entry.delete(0, END)


def add():
    first_number = entry.get()
    global first
    global math
    math = "addition"
    first = int(first_number)
    entry.delete(0, END)


def sub():
    first_number = entry.get()
    global first
    global math
    math = "subtraction"
    first = int(first_number)
    entry.delete(0, END)


def div():
    first_number = entry.get()
    global first
    global math
    math = "division"
    first = int(first_number)
    entry.delete(0, END)


def mult():
    first_number = entry.get()
    global first
    global math
    math = "multiplication"
    first = int(first_number)
    entry.delete(0, END)


def equal():
    second = entry.get()
    entry.delete(0, END)
    if math == 'addition':
        entry.insert(0, first + int(second))
    if math == 'subtraction':
        entry.insert(0, first - int(second)),
    if math == 'division':
        entry.insert(0, first / int(second)),
    if math == 'multiplication':
        entry.insert(0, first * int(second))


# create buttons for calculator
button_1 = Button(root, text="1", padx=40, pady=20, command=lambda: button_click(1))
button_2 = Button(root, text="2", padx=40, pady=20, command=lambda: button_click(2))
button_3 = Button(root, text="3", padx=40, pady=20, command=lambda: button_click(3))
button_4 = Button(root, text="4", padx=40, pady=20, command=lambda: button_click(4))
button_5 = Button(root, text="5", padx=40, pady=20, command=lambda: button_click(5))
button_6 = Button(root, text="6", padx=40, pady=20, command=lambda: button_click(6))
button_7 = Button(root, text="7", padx=40, pady=20, command=lambda: button_click(7))
button_8 = Button(root, text="8", padx=40, pady=20, command=lambda: button_click(8))
button_9 = Button(root, text="9", padx=40, pady=20, command=lambda: button_click(9))
button_0 = Button(root, text="0", padx=40, pady=20, command=lambda: button_click(0))

# operation buttons
button_equal = Button(root, text="=", padx=40, pady=52, command=equal)
button_clear = Button(root, text="C", padx=40, pady=52, command=clear)
button_add = Button(root, text="+", padx=40, pady=20, command=add)
button_sub = Button(root, text="-", padx=40, pady=20, command=sub)
button_mul = Button(root, text="x", padx=40, pady=20, command=mult)
button_div = Button(root, text="/", padx=40, pady=20, command=div)

# put buttons on the screen
button_1.grid(row=3, column=0)
button_2.grid(row=3, column=1)
button_3.grid(row=3, column=2)

button_4.grid(row=2, column=0)
button_5.grid(row=2, column=1)
button_6.grid(row=2, column=2)

button_7.grid(row=1, column=0)
button_8.grid(row=1, column=1)
button_9.grid(row=1, column=2)
button_0.grid(row=4, column=0)

button_clear.grid(row=5, rowspan=2, column=1)
button_add.grid(row=6, column=0)
button_sub.grid(row=4, column=1)
button_mul.grid(row=4, column=2)
button_div.grid(row=5, column=0)
button_equal.grid(row=5, rowspan=2, column=2)

if __name__ == '__main__':
    root.mainloop()
