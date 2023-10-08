import 'package:flutter/material.dart';

import 'package:quiz/quiz_screen.dart';
import 'package:quiz/start_screen.dart';
import 'package:quiz/data/questions.dart';

class Quiz extends StatefulWidget {
  const Quiz({super.key});

  @override
  State<Quiz> createState() {
    return _QuizState();
  }
}

class _QuizState extends State<Quiz> {
  List<String> selectedAnswers = [];

  var activeScreen = 'start-screen';

  void switchScreen() {
    setState(() {
      activeScreen = 'quiz-screen';
    });
  }

  // Widget? activeScreen;

  // @override
  // void initState() {
  //   activeScreen = StartScreen(switchScreen);
  //   super.initState();
  // }

  // void switchScreen() {
  //   setState(() {
  //     activeScreen = const QuizScreen();
  //   });
  // }

  void chooseAnswer(String answer) {
    selectedAnswers.add(answer);

    if (selectedAnswers.length == questions.length) {
      setState(() {
        selectedAnswers = [];
        activeScreen = 'start-screen';
      });
    }
  }

  @override
  Widget build(context) {
    Widget screenWidget = StartScreen(switchScreen);

    if (activeScreen == 'quiz-screen') {
      screenWidget = QuizScreen(onSelectedAnswer: chooseAnswer);
    }

    return MaterialApp(
      home: Scaffold(
          body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.purple,
              Color.fromARGB(255, 168, 93, 181),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: screenWidget,

        // child: activeScreen == 'start-screen'
        //     ? StartScreen(switchScreen)
        //     : const QuizScreen(),
      )),
    );
  }
}
