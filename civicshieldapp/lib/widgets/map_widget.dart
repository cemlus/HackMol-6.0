import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart' as location_package; // Correct import for the location package
import 'package:permission_handler/permission_handler.dart' as permission_package;

class MapWidget extends StatefulWidget {
  @override
  _MapWidgetState createState() => _MapWidgetState();
}

class _MapWidgetState extends State<MapWidget> {
  late GoogleMapController _mapController;
  location_package.Location _location = location_package.Location();
  LatLng? _currentLocation;

  final Set<Marker> _markers = {
    Marker(
      markerId: MarkerId('station1'),
      position: LatLng(28.6149, 77.2095), // Example police station location
      infoWindow: InfoWindow(title: 'Police Station A'),
    ),
    Marker(
      markerId: MarkerId('station2'),
      position: LatLng(28.6155, 77.2100), // Example police station location
      infoWindow: InfoWindow(title: 'Police Station B'),
    ),
  };

  @override
  void initState() {
    super.initState();
    _checkPermissionAndFetchLocation();
  }

  Future<void> _checkPermissionAndFetchLocation() async {
    // Check if location permission is granted using permission_handler
    if (await permission_package.Permission.location.request().isGranted) {
      // Fetch current location using location package
      bool serviceEnabled = await _location.serviceEnabled();
      if (!serviceEnabled) {
        serviceEnabled = await _location.requestService();
        if (!serviceEnabled) return;
      }

      final locationData = await _location.getLocation();
      setState(() {
        _currentLocation =
            LatLng(locationData.latitude!, locationData.longitude!);
      });
    } else {
      // Handle case where permission is denied
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Location permission denied')),
      );
    }
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;

    // Move camera to current location (if available)
    if (_currentLocation != null) {
      _mapController.animateCamera(
        CameraUpdate.newLatLngZoom(_currentLocation!, 14),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _currentLocation == null
          ? Center(child: CircularProgressIndicator())
          : GoogleMap(
              onMapCreated: _onMapCreated,
              initialCameraPosition: CameraPosition(
                target: _currentLocation!,
                zoom: 14,
              ),
              markers: _markers,
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
            ),
    );
  }
}
