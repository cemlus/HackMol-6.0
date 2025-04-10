// import 'package:flutter/material.dart';
// import 'file_complaint_screen.dart';
// import 'edit_details_screen.dart';
// import 'police_stations_screen.dart';

// class DashboardScreen extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text('Dashboard')),
//       body: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Padding(
//             padding: const EdgeInsets.all(16.0),
//             child: Text('Welcome to Dashboard', style: TextStyle(fontSize: 24)),
//           ),
//           ListTile(
//             title: Text('File a Complaint'),
//             onTap: () => Navigator.push(
//               context,
//               MaterialPageRoute(builder: (context) => FileComplaintScreen()),
//             ),
//           ),
//           ListTile(
//             title: Text('Edit Your Personal Details'),
//             onTap: () => Navigator.push(
//               context,
//               MaterialPageRoute(builder: (context) => EditDetailsScreen()),
//             ),
//           ),
//           ListTile(
//             title: Text('View Nearest Police Stations'),
//             onTap: () => Navigator.push(
//               context,
//               MaterialPageRoute(builder: (context) => PoliceStationsScreen()),
//             ),
//           ),
//           Divider(),
//           Expanded(child: Center(child: Text('Your FIR Complaints will appear here.'))),
//         ],
//       ),
//     );
//   }
// }


import 'package:flutter/material.dart';
import 'file_complaint_screen.dart';
import 'edit_details_screen.dart';
import 'police_stations_screen.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE0F7FA), // Light blue background color
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.black),
        title: Text(
          'Dashboard',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Message
              Text(
                'Welcome to Dashboard!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue.shade700,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'What would you like to do today?',
                style: TextStyle(fontSize: 16, color: Colors.grey.shade700),
              ),
              const SizedBox(height: 20),

              // Options Grid
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  // File a Complaint Card
                  _buildDashboardCard(
                    context,
                    iconData: Icons.report_problem_outlined,
                    title: 'File a Complaint',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => FileComplaintScreen()),
                      );
                    },
                  ),

                  // Edit Personal Details Card
                  _buildDashboardCard(
                    context,
                    iconData: Icons.edit_outlined,
                    title: 'Edit Details',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => EditDetailsScreen()),
                      );
                    },
                  ),

                  // View Nearest Police Stations Card
                  _buildDashboardCard(
                    context,
                    iconData: Icons.location_on_outlined,
                    title: 'Nearest Police Stations',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => PoliceStationsScreen()),
                      );
                    },
                  ),

                  // FIR Complaints Section Card
                  _buildDashboardCard(
                    context,
                    iconData: Icons.list_alt_outlined,
                    title: 'Your FIR Complaints',
                    onTap: () {
                      // Add navigation or functionality for FIR complaints
                    },
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // FIR Complaints Section Title
              Text(
                'Your FIR Complaints',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue.shade700,
                ),
              ),
              const SizedBox(height: 10),

              // FIR Complaints List Placeholder
              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 10,
                      offset: Offset(0, 5),
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    'No FIR Complaints Found',
                    style: TextStyle(fontSize: 16, color: Colors.grey.shade700),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDashboardCard(BuildContext context,
      {required IconData iconData, required String title, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 10,
              offset: Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(iconData, size: 40, color: Colors.blue.shade700),
            const SizedBox(height: 10),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.grey.shade700),
            ),
          ],
        ),
      ),
    );
  }
}
