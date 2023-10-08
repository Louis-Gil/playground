import 'package:flutter/material.dart';
import 'package:quiz/answer_button.dart';

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() {
    return _QuizScreenState();
  }
}

class _QuizScreenState extends State<QuizScreen> {
  @override
  Widget build(context) {
    return SizedBox(
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Quiz Screen',
            style: TextStyle(color: Colors.white),
          ),
          const SizedBox(height: 30),
          AnswerButton(answerText: 'answerText', onTap: () {}),
          AnswerButton(answerText: 'answerText', onTap: () {}),
          AnswerButton(answerText: 'answerText', onTap: () {}),
          AnswerButton(answerText: 'answerText', onTap: () {}),
        ],
      ),
    );
  }
}
