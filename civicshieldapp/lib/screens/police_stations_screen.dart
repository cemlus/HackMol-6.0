import 'package:flutter/material.dart';
import '../widgets/map_widget.dart';

class PoliceStationsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Nearest Police Stations')),
      body: MapWidget(),
    );
  }
}
