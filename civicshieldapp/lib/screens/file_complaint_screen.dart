import 'package:flutter/material.dart';
import '../widgets/form_field_widget.dart';

class FileComplaintScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('File a Complaint')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            FormFieldWidget(labelText: 'Complaint Title'),
            FormFieldWidget(labelText: 'Description', maxLines: 5),
            // ElevatedButton(onPressed: () {}, child: Text('Upload Supporting Files')),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    Colors.blue.shade400, // Change this to any color you prefer
                foregroundColor: Colors.white, // Text color
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text('Upload Supporting Files'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue.shade700, // Background color
                foregroundColor: Colors.white, // Text color
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text('Submit Complaint'),
            ),
          ],
        ),
      ),
    );
  }
}
