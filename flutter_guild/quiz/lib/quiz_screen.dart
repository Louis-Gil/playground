import 'package:flutter/material.dart';

import 'package:quiz/answer_button.dart';
import 'package:quiz/data/questions.dart';

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() {
    return _QuizScreenState();
  }
}

class _QuizScreenState extends State<QuizScreen> {
  final currentQuestion = questions[0];

  @override
  Widget build(context) {
    return SizedBox(
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            currentQuestion.text,
            style: const TextStyle(color: Colors.white),
          ),
          const SizedBox(height: 30),
          AnswerButton(answerText: currentQuestion.ansewers[0], onTap: () {}),
          AnswerButton(answerText: currentQuestion.ansewers[1], onTap: () {}),
          AnswerButton(answerText: currentQuestion.ansewers[2], onTap: () {}),
          AnswerButton(answerText: currentQuestion.ansewers[3], onTap: () {}),
        ],
      ),
    );
  }
}
