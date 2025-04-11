import 'package:civicshieldapp/screens/complaint_form_screen.dart';
import 'package:flutter/material.dart';
import 'edit_details_screen.dart';
import 'police_stations_screen.dart';
import 'complaint_details_screen.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String? complaintId;

  void _navigateToFileComplaint() async {
    final result = await Navigator.push(
      context,
      // MaterialPageRoute(builder: (context) => FileComplaintScreen()),
      MaterialPageRoute(builder: (context) => ComplaintFormScreen()),
    );

    if (result != null && result is String) {
      setState(() {
        complaintId = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE0F7FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.black),
        title: Text(
          'Dashboard',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome to Dashboard!',
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue.shade700),
            ),
            SizedBox(height: 10),
            Text(
              'What would you like to do today?',
              style: TextStyle(fontSize: 16, color: Colors.grey.shade700),
            ),
            SizedBox(height: 20),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildDashboardCard(context, Icons.report_problem_outlined,
                      'File a Complaint', null,
                      onTap: _navigateToFileComplaint),
                  _buildDashboardCard(context, Icons.edit_outlined,
                      'Edit Details', EditDetailsScreen()),
                  _buildDashboardCard(context, Icons.location_on_outlined,
                      'Nearest Police Stations', PoliceStationsScreen()),
                  _buildDashboardCard(
                    context,
                    Icons.list_alt_outlined,
                    'Your FIR Complaints',
                    null,
                    onTap: complaintId != null
                        ? () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ComplaintDetailsScreen(
                                    complaintId: complaintId!),
                              ),
                            );
                          }
                        : null,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.list_alt_outlined,
                            size: 40, color: Colors.blue.shade700),
                        SizedBox(height: 10),
                        Text("Complaint ID:",
                            style: TextStyle(fontWeight: FontWeight.bold)),
                        Text(complaintId ?? 'No complaints yet',
                            textAlign: TextAlign.center),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDashboardCard(
      BuildContext context, IconData iconData, String title, Widget? screen,
      {VoidCallback? onTap, Widget? child}) {
    return GestureDetector(
      onTap: onTap ??
          (screen != null
              ? () => Navigator.push(
                  context, MaterialPageRoute(builder: (context) => screen))
              : null),
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
                color: Colors.black12, blurRadius: 10, offset: Offset(0, 5))
          ],
        ),
        child: child ??
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(iconData, size: 40, color: Colors.blue.shade700),
                SizedBox(height: 10),
                Text(title,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16)),
              ],
            ),
      ),
    );
  }
}
