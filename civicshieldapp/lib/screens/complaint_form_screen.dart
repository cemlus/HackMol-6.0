import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

class ComplaintFormScreen extends StatefulWidget {
  @override
  _ComplaintFormScreenState createState() => _ComplaintFormScreenState();
}

class _ComplaintFormScreenState extends State<ComplaintFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();
  final TextEditingController _evidenceDescriptionController = TextEditingController();
  final TextEditingController _contactController = TextEditingController();

  String complaintType = '';
  List<File> evidenceFiles = [];
  bool isSubmitting = false;

  final String accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2Y3ODU5NjE5NjgxYjRmYzRjMjY5MmYiLCJlbWFpbCI6InNheGVuYS5zaGlraGFyMDVAZ21haWwuY29tIiwicm9sZSI6InBvbGljZSIsImlhdCI6MTc0NDM0MTk4OCwiZXhwIjoxNzQ0MzQ5MTg4fQ.qwhjgcxdw1UtwpT0bnS_Entkr2AFgxqtrP_mGaEx-mQ';

  Future<void> _pickFiles() async {
    final picker = ImagePicker();
    final pickedFiles = await picker.pickMultiImage();
    if (pickedFiles != null) {
      setState(() {
        evidenceFiles.addAll(pickedFiles.map((x) => File(x.path)));
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => isSubmitting = true);

    var request = http.MultipartRequest(
      'POST',
      // Uri.parse('http://192.168.50.91:8000/complaintForm'),
      Uri.parse('https://backend.topishukla.xyz/complaintForm'),
    );

    request.headers['Cookie'] = 'accessToken=$accessToken';

    request.fields['complaintType'] = complaintType;
    request.fields['description'] = _descriptionController.text;
    request.fields['location'] = _locationController.text;
    request.fields['evidenceDescription'] = _evidenceDescriptionController.text;
    request.fields['contact'] = _contactController.text;

    for (var file in evidenceFiles) {
      request.files.add(await http.MultipartFile.fromPath('evidence', file.path));
    }

    try {
      var response = await request.send();
      final respStr = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        final data = jsonDecode(respStr);
        final complaintId = data['complaintId'] ?? 'Unknown';

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('✅ Complaint submitted! ID: $complaintId')),
        );
        // Navigator.pop(context);
        Navigator.pop(context, complaintId);
      } else {
        throw Exception('Server responded with ${response.statusCode}: $respStr');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('❌ Failed to submit complaint: $e')),
      );
    }

    setState(() => isSubmitting = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('File a Complaint'),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              DropdownButtonFormField<String>(
                value: complaintType.isNotEmpty ? complaintType : null,
                items: [
                  "Noise Complaint",
                  "Traffic Violation",
                  "Suspicious Activity",
                  "Harassment",
                  "Vandalism",
                  "Domestic Dispute",
                  "Theft",
                  "Fraud",
                  "Fire Emergency",
                  "Other"
                ].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
                onChanged: (val) => setState(() => complaintType = val ?? ''),
                decoration: InputDecoration(labelText: 'Complaint Type'),
                validator: (value) => value == null || value.isEmpty
                    ? 'Please select a complaint type'
                    : null,
              ),
              SizedBox(height: 10),
              TextFormField(
                controller: _descriptionController,
                decoration: InputDecoration(labelText: 'Description'),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter a description' : null,
              ),
              SizedBox(height: 10),
              TextFormField(
                controller: _locationController,
                decoration: InputDecoration(labelText: 'Location'),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter a location' : null,
              ),
              SizedBox(height: 10),
              ElevatedButton(
                onPressed: _pickFiles,
                child: Text("Attach Evidence"),
              ),
              SizedBox(height: 10),
              evidenceFiles.isNotEmpty
                  ? Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: evidenceFiles
                          .map((file) => Image.file(
                                file,
                                width: 100,
                                height: 100,
                                fit: BoxFit.cover,
                              ))
                          .toList(),
                    )
                  : Text("No files selected"),
              SizedBox(height: 10),
              TextFormField(
                controller: _evidenceDescriptionController,
                decoration: InputDecoration(labelText: 'Evidence Description'),
                validator: (value) =>
                    value!.isEmpty ? 'Please describe the evidence' : null,
              ),
              SizedBox(height: 10),
              TextFormField(
                controller: _contactController,
                decoration: InputDecoration(labelText: 'Contact Details (Phone/Email)'),
                validator: (value) =>
                    value!.isEmpty ? 'Please provide contact details' : null,
              ),
              SizedBox(height: 20),
              isSubmitting
                  ? Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      onPressed: _submitForm,
                      child: Text('Submit Complaint', style: TextStyle(fontSize: 18)),
                      style: ElevatedButton.styleFrom(padding: EdgeInsets.all(16)),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
