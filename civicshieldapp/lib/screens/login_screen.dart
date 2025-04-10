
// import 'package:flutter/material.dart';
// import 'dashboard_screen.dart';
// import 'signup_screen.dart';

// class LoginScreen extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: const Color(0xFFE0F7FA), // Light blue background color
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             // Logo Image
//             Image.asset(
//               'assets/CivicShield.png', // Path to the CivicShield logo
//               width: 500,
//               height: 500,
//             ),
//             // const SizedBox(height: 10),

//             // App Name
//             // const SizedBox(height: 40),

//             // Buttons Row
//             Row(
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [
//                 // Login Button
//                 ElevatedButton(
//                   onPressed: () {
//                     // Navigate to Dashboard Screen
//                     Navigator.push(
//                       context,
//                       MaterialPageRoute(builder: (context) => DashboardScreen()),
//                     );
//                   },
//                   style: ElevatedButton.styleFrom(
//                     padding:
//                         const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
//                     backgroundColor: Colors.blue.shade300,
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(10),
//                     ),
//                   ),
//                   child: const Text(
//                     'LOGIN',
//                     style: TextStyle(fontSize: 16, color: Colors.white),
//                   ),
//                 ),
//                 const SizedBox(width: 20), // Space between buttons

//                 // Sign Up Button
//                 ElevatedButton(
//                   onPressed: () {
//                     // Navigate to Signup Screen
//                     Navigator.push(
//                       context,
//                       MaterialPageRoute(builder: (context) => SignupScreen()),
//                     );
//                   },
//                   style: ElevatedButton.styleFrom(
//                     padding:
//                         const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
//                     backgroundColor: Colors.blue.shade300,
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(10),
//                     ),
//                   ),
//                   child: const Text(
//                     'Sign Up',
//                     style: TextStyle(fontSize: 16, color: Colors.white),
//                   ),
//                 ),
//               ],
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }


// import 'package:flutter/material.dart';
// import 'dashboard_screen.dart';
// import 'signup_screen.dart';

// class LoginScreen extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: const Color(0xFFE0F7FA), // Light blue background color
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             // Logo Image
//             Image.asset(
//               'assets/CivicShield.png', // Path to the CivicShield logo
//               width: 500,
//               height: 500,
//             ),
//             // const SizedBox(height: 10),

//             // App Name
//             // const SizedBox(height: 40),

//             // Buttons Row
//             Row(
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [
//                 // Login Button
//                 ElevatedButton(
//                   onPressed: () {
//                     // Navigate to Dashboard Screen
//                     Navigator.push(
//                       context,
//                       MaterialPageRoute(builder: (context) => DashboardScreen()),
//                     );
//                   },
//                   style: ElevatedButton.styleFrom(
//                     padding:
//                         const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
//                     backgroundColor: Colors.blue.shade300,
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(10),
//                     ),
//                   ),
//                   child: const Text(
//                     'LOGIN',
//                     style: TextStyle(fontSize: 16, color: Colors.white),
//                   ),
//                 ),
//                 const SizedBox(width: 20), // Space between buttons

//                 // Sign Up Button
//                 ElevatedButton(
//                   onPressed: () {
//                     // Navigate to Signup Screen
//                     Navigator.push(
//                       context,
//                       MaterialPageRoute(builder: (context) => SignupScreen()),
//                     );
//                   },
//                   style: ElevatedButton.styleFrom(
//                     padding:
//                         const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
//                     backgroundColor: Colors.blue.shade300,
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(10),
//                     ),
//                   ),
//                   child: const Text(
//                     'Sign Up',
//                     style: TextStyle(fontSize: 16, color: Colors.white),
//                   ),
//                 ),
//               ],
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }


import 'package:flutter/material.dart';
import 'login_page.dart';
import 'signup_screen.dart';

class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE0F7FA), // Light blue background color
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo Image
            Image.asset(
              'assets/CivicShield.png', // Path to the CivicShield logo
              width: 150,
              height: 150,
            ),
            const SizedBox(height: 20),

            // App Name
            Text(
              'CivicShield',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 40),

            // Buttons Row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Login Button
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => LoginPage()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
                    backgroundColor: Colors.blue.shade300,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text(
                    'LOGIN',
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 20), // Space between buttons

                // Sign Up Button
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => SignupScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
                    backgroundColor: Colors.blue.shade300,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text(
                    'Sign Up',
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
