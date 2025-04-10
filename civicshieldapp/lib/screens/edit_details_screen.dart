import 'package:flutter/material.dart';
import '../widgets/form_field_widget.dart';

class EditDetailsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Add Evidence')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            FormFieldWidget(labelText: 'Complaint ID'),
            ElevatedButton(onPressed: () {}, child: Text('Upload File')),
            FormFieldWidget(labelText: 'Describe Evidence'),
            SizedBox(height: 20),
            ElevatedButton(onPressed: () {}, child: Text('Submit Evidence')),
          ],
        ),
      ),
    );
  }
}
