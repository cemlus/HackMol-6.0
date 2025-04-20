import 'package:flutter/material.dart';

class PoliceStationsScreen extends StatelessWidget {
  // Example list of police stations (static data)
  final List<Map<String, String>> policeStations = [
    {
      'name': 'Central Police Station',
      'address': '123 Main Street, Springfield',
      'phone': '+1 234 567 890',
    },
    {
      'name': 'Northside Police Station',
      'address': '456 Elm Street, Springfield',
      'phone': '+1 987 654 321',
    },
    {
      'name': 'Eastside Police Station',
      'address': '789 Oak Avenue, Springfield',
      'phone': '+1 555 123 456',
    },
    {
      'name': 'Westside Police Station',
      'address': '321 Pine Road, Springfield',
      'phone': '+1 444 987 654',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Nearby Police Stations'),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView.builder(
          itemCount: policeStations.length,
          itemBuilder: (context, index) {
            final station = policeStations[index];
            return _buildPoliceStationCard(station);
          },
        ),
      ),
    );
  }

  Widget _buildPoliceStationCard(Map<String, String> station) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      elevation: 4,
      child: ListTile(
        leading: Icon(Icons.local_police, color: Colors.blue, size: 40),
        title: Text(
          station['name']!,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 4),
            Text(station['address']!, style: TextStyle(fontSize: 14)),
            SizedBox(height: 4),
            Text('Phone: ${station['phone']!}', style: TextStyle(fontSize: 14)),
          ],
        ),
        trailing: IconButton(
          icon: Icon(Icons.phone, color: Colors.green),
          onPressed: () {
            // Placeholder for calling functionality
            print('Calling ${station['phone']}');
          },
        ),
      ),
    );
  }
}


