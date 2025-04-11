import 'package:flutter/material.dart';

class UserDataScreen extends StatelessWidget {
  final Map<String, String> userData = {
    'Name': 'John Doe',
    'Email': 'johndoe@example.com',
    'Phone': '+1 234 567 890',
    'Address': '123 Main Street, Springfield',
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('User Data'),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your Profile Information',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue.shade700),
            ),
            SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: userData.length,
                itemBuilder: (context, index) {
                  String key = userData.keys.elementAt(index);
                  String value = userData[key]!;
                  return _buildUserDataTile(key, value);
                },
              ),
            ),
            SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  // Add functionality to edit user details
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Edit functionality coming soon!')));
                },
                child: Text('Edit Details'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUserDataTile(String key, String value) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: ListTile(
        title: Text(key, style: TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(value),
        leading: Icon(Icons.person_outline, color: Colors.blue),
      ),
    );
  }
}
