// import 'package:flutter/material.dart';
// import '../widgets/form_field_widget.dart';

// class SignupScreen extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text('Sign Up')),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: ListView(
//           children: [
//             FormFieldWidget(labelText: 'Name'),
//             FormFieldWidget(labelText: 'Email'),
//             FormFieldWidget(labelText: 'Phone Number'),
//             FormFieldWidget(labelText: 'Current Address'),
//             FormFieldWidget(labelText: 'Password', obscureText: true),
//             ElevatedButton(onPressed: () {}, child: Text('Upload File')),
//             SizedBox(height: 20),
//             ElevatedButton(onPressed: () {}, child: Text('Submit')),
//           ],
//         ),
//       ),
//     );
//   }
// }


// import 'package:flutter/material.dart';

// class SignupScreen extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: const Color(0xFFE0F7FA), // Light blue background color
//       appBar: AppBar(
//         backgroundColor: Colors.white,
//         elevation: 0,
//         iconTheme: IconThemeData(color: Colors.black),
//         title: Text(
//           'Sign Up',
//           style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
//         ),
//       ),
//       body: Center(
//         child: SingleChildScrollView(
//           child: Container(
//             padding: const EdgeInsets.all(16.0),
//             margin: const EdgeInsets.symmetric(horizontal: 20),
//             decoration: BoxDecoration(
//               color: Colors.white,
//               borderRadius: BorderRadius.circular(10),
//               boxShadow: [
//                 BoxShadow(
//                   color: Colors.black12,
//                   blurRadius: 10,
//                   offset: Offset(0, 5),
//                 ),
//               ],
//             ),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 // Title
//                 Center(
//                   child: Text(
//                     'Create Your Account',
//                     style: TextStyle(
//                       fontSize: 22,
//                       fontWeight: FontWeight.bold,
//                       color: Colors.blue.shade700,
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 20),

//                 // Name Field
//                 TextField(
//                   decoration: InputDecoration(
//                     labelText: 'Name',
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 16),

//                 // Email Field
//                 TextField(
//                   decoration: InputDecoration(
//                     labelText: 'Email',
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 16),

//                 // Phone Number Field
//                 TextField(
//                   decoration: InputDecoration(
//                     labelText: 'Phone Number',
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 16),

//                 // Current Address Field
//                 TextField(
//                   decoration: InputDecoration(
//                     labelText: 'Current Address',
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 16),

//                 // Password Field
//                 TextField(
//                   obscureText: true,
//                   decoration: InputDecoration(
//                     labelText: 'Password',
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 20),

//                 // Upload File Button
//                 ElevatedButton.icon(
//                   onPressed: () {
//                     // Upload file logic here
//                   },
//                   icon: Icon(Icons.upload_file, size: 30),
//                   label: Text('Upload File', style: TextStyle(fontSize: 15)),
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: Colors.blue.shade300,
//                     padding: const EdgeInsets.symmetric(vertical: 12),
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 20),

//                 // Submit Button
//                 ElevatedButton(
//                   onPressed: () {
//                     // Submit form logic here
//                   },
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: Colors.blue.shade700,
//                     padding: const EdgeInsets.symmetric(vertical: 12),
//                     shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                   ),
//                   child: Center(
//                     child: Text(
//                       'Submit',
//                       style: TextStyle(fontSize: 18, color: Colors.white),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }


// import 'package:flutter/material.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'dashboard_screen.dart';

// class SignupScreen extends StatefulWidget {
//   @override
//   _SignupScreenState createState() => _SignupScreenState();
// }

// class _SignupScreenState extends State<SignupScreen> {
//   final _formKey = GlobalKey<FormState>();
//   final _emailController = TextEditingController();
//   final _passwordController = TextEditingController();
//   bool _isLoading = false;

//   Future<void> _signup() async {
//     if (!_formKey.currentState!.validate()) return;
//     setState(() => _isLoading = true);

//     try {
//       await FirebaseAuth.instance.createUserWithEmailAndPassword(
//         email: _emailController.text.trim(),
//         password: _passwordController.text.trim(),
//       );
//       Navigator.pushReplacement(
//         context,
//         MaterialPageRoute(builder: (context) => DashboardScreen()),
//       );
//     } on FirebaseAuthException catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text(_errorMessage(e.code))),
//       );
//     } finally {
//       setState(() => _isLoading = false);
//     }
//   }

//   String _errorMessage(String code) {
//     switch (code) {
//       case 'weak-password': return 'Password too weak';
//       case 'email-already-in-use': return 'Email already registered';
//       default: return 'Registration failed';
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text('Sign Up')),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Form(
//           key: _formKey,
//           child: ListView(
//             children: [
//               TextFormField(
//                 decoration: InputDecoration(labelText: 'Name'),
//                 validator: (value) => 
//                   value!.isEmpty ? 'Enter your name' : null,
//               ),
//               TextFormField(
//                 controller: _emailController,
//                 decoration: InputDecoration(labelText: 'Email'),
//                 keyboardType: TextInputType.emailAddress,
//                 validator: (value) => 
//                   value!.contains('@') ? null : 'Enter valid email',
//               ),
//               TextFormField(
//                 decoration: InputDecoration(labelText: 'Phone Number'),
//                 keyboardType: TextInputType.phone,
//               ),
//               TextFormField(
//                 decoration: InputDecoration(labelText: 'Address'),
//               ),
//               TextFormField(
//                 controller: _passwordController,
//                 decoration: InputDecoration(labelText: 'Password'),
//                 obscureText: true,
//                 validator: (value) => 
//                   value!.length >= 6 ? null : 'Minimum 6 characters',
//               ),
//               ElevatedButton(
//                 onPressed: () {}, 
//                 child: Text('Upload File'),
//               ),
//               SizedBox(height: 20),
//               ElevatedButton(
//                 onPressed: _isLoading ? null : _signup,
//                 child: _isLoading
//                   ? CircularProgressIndicator()
//                   : Text('Submit'),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }


import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dashboard_screen.dart'; // Replace with your actual DashboardScreen import

class SignupScreen extends StatefulWidget {
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignupScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isLoading = false;

  void _signUp() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      print("✅ User signed up: ${userCredential.user?.uid}");

      // Navigate to Dashboard
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => DashboardScreen()),
      );
    } catch (e, stackTrace) {
      print("❌ Sign-up error: $e");
      print("📌 Stack trace: $stackTrace");

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Sign-up failed: ${e.toString()}"),
          backgroundColor: Colors.redAccent,
        ),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sign Up'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Email field
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),

            // Password field
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),

            // Sign Up button
            _isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _signUp,
                    child: Text('Sign Up'),
                  ),
          ],
        ),
      ),
    );
  }
}
