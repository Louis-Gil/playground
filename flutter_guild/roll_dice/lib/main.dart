import 'package:flutter/material.dart';

import 'package:roll_dice/gradient_container.dart';

void main() {
  runApp(
    const MaterialApp(
      home: Scaffold(
          body: GradientContainer(
        Colors.blue,
        Color.fromARGB(255, 87, 172, 241),
      )),
    ),
  );
}
