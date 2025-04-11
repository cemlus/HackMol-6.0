// Replace the CardHeader section with this:

import type React from "react"
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { MapPin, Phone, Clock, Users, Navigation, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { cn } from "@/lib/utils"
import { useIsMobile } from "../components/hooks/UseIsMobile"

// Mock data for police stations
const policeStations = [
    // hard coded values as of now
  {
    id: 1,
    name: "Andheri Police Station",
    address: "Andheri East, Mumbai, Maharashtra 400069",
    phone: "+91 22 2683 4343",
    distance: 1.2,
    responseTime: "10 min",
    crowdStatus: "Available",
    position: [19.1136, 72.8697],
  },
  {
    id: 2,
    name: "Bandra Police Station",
    address: "Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 22 2642 5111",
    distance: 3.5,
    responseTime: "15 min",
    crowdStatus: "Busy",
    position: [19.0596, 72.8295],
  },
  {
    id: 3,
    name: "Juhu Police Station",
    address: "Juhu, Mumbai, Maharashtra 400049",
    phone: "+91 22 2670 1307",
    distance: 2.8,
    responseTime: "12 min",
    crowdStatus: "Moderate",
    position: [19.1075, 72.8263],
  },
  {
    id: 4,
    name: "Powai Police Station",
    address: "Powai, Mumbai, Maharashtra 400076",
    phone: "+91 22 2570 3893",
    distance: 4.2,
    responseTime: "18 min",
    crowdStatus: "Available",
    position: [19.1176, 72.906],
  },
  {
    id: 5,
    name: "Dadar Police Station",
    address: "Dadar, Mumbai, Maharashtra 400014",
    phone: "+91 22 2430 8100",
    distance: 5.7,
    responseTime: "20 min",
    crowdStatus: "Busy",
    position: [19.0178, 72.8478],
  },
]

// Location Marker component
const LocationMarker = ({ position, setPosition }: any) => {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom())
    }
  }, [position, map])

  return position ? <Marker position={position} /> : null
}

const NearestStations: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [searchRadius, setSearchRadius] = useState(5)
  const [activeTab, setActiveTab] = useState("map")
  const [selectedStation, setSelectedStation] = useState<number | null>(null)
  const isMobile = useIsMobile()

  // Handle getting current location
  const handleGetLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition([latitude, longitude])
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
    }
  }

  // Filter stations based on search radius
  const filteredStations = policeStations
    .filter((station) => station.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Nearest Police Stations</h1>

      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 space-y-4">
        <Card>
            <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Find Stations Near You</CardTitle>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="map">Map View</TabsTrigger>
                        <TabsTrigger value="list">List View</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Button
                  onClick={handleGetLocation}
                  className="bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white"
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <>Getting your location...</>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Use My Location
                    </>
                  )}
                </Button>

                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor="searchRadius" className="block text-xs text-gray-500 mb-1">
                      Search Radius: {searchRadius} km
                    </label>
                    <input
                      id="searchRadius"
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="map" className="mt-0">
                <div className="h-[400px] border rounded-md overflow-hidden">
                  {typeof window !== "undefined" && (
                    <MapContainer
                      center={position || [19.076, 72.8777]} // Default to Mumbai
                      zoom={12}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {position && (
                        <Marker position={position}>
                          <Popup>Your Location</Popup>
                        </Marker>
                      )}

                      {filteredStations.map((station) => (
                        <Marker
                          key={station.id}
                          position={station.position as [number, number]}
                          eventHandlers={{
                            click: () => {
                              setSelectedStation(station.id)
                            },
                          }}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-bold">{station.name}</p>
                              <p className="text-xs">{station.distance} km away</p>
                              <p className="text-xs mt-1">{station.address}</p>
                              <div className="flex items-center mt-2 text-xs">
                                <span
                                  className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                    station.crowdStatus === "Available"
                                      ? "bg-green-100 text-green-800"
                                      : station.crowdStatus === "Moderate"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800",
                                  )}
                                >
                                  {station.crowdStatus}
                                </span>
                                <span className="ml-2">Response: {station.responseTime}</span>
                              </div>
                              <Button size="sm" className="w-full mt-2 text-xs bg-[#2A3B7D] hover:bg-[#1e2a5a]">
                                <Navigation className="h-3 w-3 mr-1" />
                                Get Directions
                              </Button>
                            </div>
                          </Popup>
                        </Marker>
                      ))}

                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Station Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Distance
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Response Time
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredStations.map((station) => (
                          <tr
                            key={station.id}
                            className={cn("hover:bg-gray-50", selectedStation === station.id && "bg-blue-50")}
                            onClick={() => setSelectedStation(station.id)}
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {station.name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{station.distance} km</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                  station.crowdStatus === "Available"
                                    ? "bg-green-100 text-green-800"
                                    : station.crowdStatus === "Moderate"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800",
                                )}
                              >
                                {station.crowdStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                              {station.responseTime}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                              <Button size="sm" className="text-xs bg-[#2A3B7D] hover:bg-[#1e2a5a]">
                                <Navigation className="h-3 w-3 mr-1" />
                                Directions
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-1/3 space-y-4">
          {selectedStation ? (
            <Card>
              <CardHeader>
                <CardTitle>Station Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredStations
                  .filter((s) => s.id === selectedStation)
                  .map((station) => (
                    <div key={station.id} className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{station.name}</h3>
                        <p className="text-sm text-gray-600">{station.address}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Distance</p>
                            <p className="text-sm font-medium">{station.distance} km</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Response Time</p>
                            <p className="text-sm font-medium">{station.responseTime}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                station.crowdStatus === "Available"
                                  ? "text-green-600"
                                  : station.crowdStatus === "Moderate"
                                    ? "text-yellow-600"
                                    : "text-red-600",
                              )}
                            >
                              {station.crowdStatus}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="text-sm font-medium">{station.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <Button className="w-full bg-[#2A3B7D] hover:bg-[#1e2a5a]">
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>

                        <Button variant="outline" className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Station
                        </Button>

                        <Button variant="outline" className="w-full text-[#FF4D4D] border-[#FF4D4D]">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Report Emergency
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Station Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Station Selected</h3>
                  <p className="text-sm text-gray-500">
                    Select a station from the map or list to view detailed information.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* sirf dekhne mein achcha lag raha hai isliye daala hai */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Police Emergency</p>
                    <p className="text-xs text-gray-500">24/7 Helpline</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-red-600">100</p>
              </div>

              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ambulance</p>
                    <p className="text-xs text-gray-500">Medical Emergency</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-blue-600">108</p>
              </div>

              <div className="flex items-center justify-between p-2 bg-orange-50 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fire Department</p>
                    <p className="text-xs text-gray-500">Fire Emergency</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-600">101</p>
              </div>

              <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Women Helpline</p>
                    <p className="text-xs text-gray-500">24/7 Support</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">1091</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NearestStations