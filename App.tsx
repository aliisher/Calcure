import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { evaluate, pi, sqrt, log, sin, cos, tan } from 'mathjs';

const buttons = [
  ['C', 'π', '√', '^'],
  ['sin', 'cos', 'tan', 'log'],
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const isDark = useColorScheme() === 'dark';

  const handlePress = btn => {
    if (btn === 'C') {
      setInput('');
      setResult('');
    } else if (btn === '=') {
      try {
        let expression = input
          .replace(/π/g, pi)
          .replace(/√/g, 'sqrt')
          .replace(/log/g, 'log')
          .replace(/sin/g, 'sin')
          .replace(/cos/g, 'cos')
          .replace(/tan/g, 'tan');
        const res = evaluate(expression);
        setResult(res.toString());
      } catch {
        setResult('Error');
      }
    } else {
      setInput(prev => prev + btn);
    }
  };

  const getBtnStyle = btn => {
    const isOperator = ['+', '-', '*', '/', '=', '^'].includes(btn);
    const isFunc = ['sin', 'cos', 'tan', 'log', '√', 'π'].includes(btn);
    const isClear = btn === 'C';
    return [
      styles.btn,
      {
        backgroundColor: isClear
          ? isDark
            ? '#3D3D5C'
            : '#D4D4D6'
          : isOperator
          ? '#FF9500'
          : isFunc
          ? isDark
            ? '#2E2E3A'
            : '#E1E1E5'
          : isDark
          ? '#2E2E3A'
          : '#fff',
      },
    ];
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1E1E2C' : '#F1F1F5' },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.resultBox}>
        <Text style={[styles.input, { color: isDark ? '#bbb' : '#333' }]}>
          {input}
        </Text>
        <Text style={[styles.result, { color: isDark ? '#fff' : '#000' }]}>
          = {result}
        </Text>
      </View>
      <View>
        {buttons.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map(btn => (
              <TouchableOpacity
                key={btn}
                style={getBtnStyle(btn)}
                onPress={() => handlePress(btn)}
              >
                <Text
                  style={[
                    styles.btnText,
                    {
                      color: ['+', '-', '*', '/', '=', '^'].includes(btn)
                        ? '#fff'
                        : isDark
                        ? '#fff'
                        : '#000',
                    },
                  ]}
                >
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-end' },
  resultBox: { marginBottom: 30, alignItems: 'flex-end' },
  input: { fontSize: 20, marginBottom: 10 },
  result: { fontSize: 36, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  btn: {
    flex: 1,
    height: 65,
    marginHorizontal: 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { fontSize: 22, fontWeight: '600' },
});
