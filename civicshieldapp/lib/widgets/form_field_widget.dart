import 'package:flutter/material.dart';

class FormFieldWidget extends StatelessWidget {
  final String labelText;
  final bool obscureText;
  final int maxLines;

  FormFieldWidget({
    required this.labelText,
    this.obscureText = false,
    this.maxLines = 1,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        obscureText: obscureText,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: labelText,
          border: OutlineInputBorder(),
        ),
      ),
    );
  }
}
