import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

if __name__ == '__main__':
    humidity = ctrl.Antecedent(np.arange(0, 101, 1), 'humidity')
    humidity.automf(3, names=['low humidity', 'normal humidity', 'high humidity'], invert=True)
    humidity['low humidity'] = fuzz.trimf(humidity.universe, [0, 0, 41])
    humidity['normal humidity'] = fuzz.trimf(humidity.universe, [41, 41, 67])
    humidity['high humidity'] = fuzz.trimf(humidity.universe, [67, 67, 100])

    temperature = ctrl.Antecedent(np.arange(0, 31, 1), 'temperature')
    temperature.automf(3, names=['low temperature', 'normal temperature', 'high temperature'], invert=True)
    temperature['low temperature'] = fuzz.trimf(temperature.universe, [0, 0, 15])
    temperature['normal temperature'] = fuzz.trimf(temperature.universe, [15, 15, 20])
    temperature['high temperature'] = fuzz.trimf(temperature.universe, [20, 20, 45])

    weather = ctrl.Consequent(np.arange(0, 11, 1), 'weather')
    weather['Bad'] = fuzz.trimf(weather.universe, [0, 0, 4])
    weather['Not so bad'] = fuzz.trimf(weather.universe, [4, 4, 7])
    weather['Good'] = fuzz.trimf(weather.universe, [7, 10, 10])

    humidity.view()

    temperature.view()

    weather.view()

    rule1 = ctrl.Rule(antecedent=(humidity['normal humidity'] & temperature['normal temperature']),
                      consequent=weather['Not so bad'],
                      label='R1')
    rule2 = ctrl.Rule(antecedent=(humidity['normal humidity'] & temperature['high temperature']),
                      consequent=weather['Not so bad'],
                      label='R2')
    rule3 = ctrl.Rule(antecedent=(humidity['low humidity'] & temperature['normal temperature']),
                      consequent=weather['Good'],
                      label='R3')
    rule4 = ctrl.Rule(antecedent=(humidity['high humidity'] & temperature['low temperature']),
                      consequent=weather['Bad'],
                      label='R4')
    rule5 = ctrl.Rule(antecedent=(humidity['low humidity'] & temperature['high temperature']),
                      consequent=weather['Good'],
                      label='R5')
    weather_system = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5])

    weather_calc = ctrl.ControlSystemSimulation(weather_system)

    try:
        for x in (
                {'humidity': 66.55, 'temperature': 20.03},
                {'humidity': 41.00, 'temperature': 18.45},
                {'humidity': 42.20, 'temperature': 19.44},
                {'humidity': 39.34, 'temperature': 19.77},
                {'humidity': 84.34, 'temperature': 14.34},
                {'humidity': 38.34, 'temperature': 21.00},
        ):
            weather_calc.inputs(x)
            weather_calc.compute()
            print(weather_calc.output['weather'])
            weather.view(sim=weather_calc)
    except ValueError as err:
        print(err)
