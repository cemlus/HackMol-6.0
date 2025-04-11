import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import { useDropzone } from "react-dropzone"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { format } from "date-fns"
import {
  AlertCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Trash2,
  MapPin,
  Loader2,
  Car,
  Stethoscope,
  Flame,
  Bell,
  HelpCircle,
  PaintRoller,
  FileWarningIcon,
  StepBackIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

// Define the form data type
type ComplaintFormData = {
  complaintType: string
  // complaintSubtype: string
  description: string
  incidentDate: string
  incidentTime: string
  isHappeningNow: boolean
  evidence: File[]
  evidenceTags: Record<string, string>
  location: {
    lat: number
    lng: number
    address: string
  }
  consentAuthenticity: boolean
}

// Location Marker component
const LocationMarker = ({ position, setPosition }: any) => {
  const map = useMapEvents({
    click(e: any) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position ? <Marker position={position} /> : null
}

const ComplaintForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [caseId, setCaseId] = useState("")

  const methods = useForm<ComplaintFormData>({
    defaultValues: {
      // complaintSubtype: "",
      complaintType: ``,
      description: "",
      incidentDate: format(new Date(), "yyyy-MM-dd"),
      incidentTime: format(new Date(), "HH:mm"),
      isHappeningNow: true,
      evidence: [],
      evidenceTags: {},
      location: {
        lat: 0,
        lng: 0,
        address: "",
      },
      consentAuthenticity: false,
    },
  })

  const navigate = useNavigate();

  const {
    register,
    // handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    getValues
  } = methods

  // setValue sets value in this way => setValue("the key to be set", value to be stored in that key)

  const complaintType = watch("complaintType")
  const description = watch("description")
  const isHappeningNow = watch("isHappeningNow")
  const evidence = watch("evidence")

  // Dropzone for file uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
      "video/*": [".mp4", ".mov"],
    },
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setValue("evidence", [...evidence, ...acceptedFiles])
    },
  })

  const getAISuggestions = async(description: string, complaintType: string) => {
    try{

      const formData = {
        description: description,
        complaintType: complaintType,
      }
      const response = await axios.post("http://localhost:8000/questionRecommendation", formData,{
        withCredentials: true,
      })

      setAiSuggestions(response.data.questions)

      // console.log(response.data)

      return response.data
    }
    catch(err){
      console.error("Error fetching AI suggestions:", err)
      return []
    }
  }
  // console.log("AI: ",aiSuggestions)

  // Handle complaint type selection
  const handleComplaintTypeSelect = (type: string) => {
    setValue("complaintType", type)
    // setValue("complaintSubtype", "")
    // setAiSuggestions(getAISuggestions(type))
  }

  // Handle AI suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setValue("description", `${description}${suggestion}`)
  }

  // Handle "happening now" toggle
  const handleHappeningNowToggle = () => {
    setValue("isHappeningNow", !isHappeningNow)
    if (!isHappeningNow) {
      setValue("incidentDate", format(new Date(), "yyyy-MM-dd"))
      setValue("incidentTime", format(new Date(), "HH:mm"))
    }
  }

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const newFiles = [...evidence]
    newFiles.splice(index, 1)
    setValue("evidence", newFiles)
  }

  // Handle evidence tag change
  const handleTagChange = (fileIndex: number, tag: string) => {
    const evidenceTags = { ...watch("evidenceTags") }
    evidenceTags[fileIndex] = tag
    setValue("evidenceTags", evidenceTags)
  }

  // Handle getting current location
  const handleGetLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition({ lat: latitude, lng: longitude })
          setValue("location", {
            lat: latitude,
            lng: longitude,
            address: "Current location",
          })
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
        },
      )
      console.log(position)
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
    }
  }

  // Handle form submission
  const submitMutation = useMutation({
    mutationFn: async (data: ComplaintFormData) => {
      // make the Backend/Blockchain API call here 
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          // Generate a random case ID
          const caseId = Math.random().toString(36).substring(2, 6).toUpperCase()
          resolve(caseId)
        }, 2000)
      })
    },
    onSuccess: (data) => {
      setCaseId(data)
      setSubmissionSuccess(true)
      setIsSubmitting(false)
    },
    onError: () => {
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: ComplaintFormData) => {
    setIsSubmitting(true)
    submitMutation.mutate(data)
  }

  // Handle next step
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
  
    const data = getValues(); // Get all form values from react-hook-form
    // const formDataToSend = new FormData();

    // console.log(formDataToSend)
    const formData = {
      complaintType: data.complaintType,
      description: data.description,
      location:  data.location.address
    }
    const formDataToSend = new FormData();
    formDataToSend.append("complaintType", data.complaintType);
    formDataToSend.append("description", data.description);
    formDataToSend.append("location", data.location.address);
  
    // Add evidence files
    if (data.evidence && data.evidence.length > 0) {
      data.evidence.forEach((file: File) => {
        formDataToSend.append("evidence", file); // or "evidence[]" if your backend expects array
      });
    }
  
    // Add tags (assumes it's an object with index keys)
    const tags = data.evidenceTags || {};
    Object.keys(tags).forEach((index) => {
      formDataToSend.append(`tags[${index}]`, tags[index]);
    });
  
    // Add checkbox (boolean -> string)
    formDataToSend.append("consentAuthenticity", data.consentAuthenticity ? "true" : "false");
  
    try {
      console.log(formDataToSend)
      const response = await axios.post("http://localhost:8000/complaintForm", formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        alert("Complaint submitted successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting complaint", error);
      alert("Failed to submit complaint. Please try again.");
    }
  
    setIsSubmitting(false);
  };
  

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2A3B7D]">Complaint Type</h2>
            <p className="text-gray-600">Select the type of complaint you want to file.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2 border-2",
                  complaintType === "theft" ? "border-[#2A3B7D] bg-blue-50" : "border-gray-200",
                )}
                onClick={() => handleComplaintTypeSelect("theft")}
              >
                <Car className="h-6 w-6" />
                <span>Theft</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2 border-2",
                  complaintType === "noise" ? "border-[#2A3B7D] bg-blue-50" : "border-gray-200",
                )}
                onClick={() => handleComplaintTypeSelect("noise")}
              >
                <StepBackIcon className="h-6 w-6" />
                <span>Noise</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2 border-2",
                  complaintType === "medical" ? "border-[#2A3B7D] bg-blue-50" : "border-gray-200",
                )}
                onClick={() => handleComplaintTypeSelect("medical")}
              >
                <Stethoscope className="h-6 w-6" />
                <span>Medical</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2 border-2",
                  complaintType === "fire" ? "border-[#2A3B7D] bg-blue-50" : "border-gray-200",
                )}
                onClick={() => handleComplaintTypeSelect("fire")}
              >
                <Flame className="h-6 w-6" />
                <span>Fire</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2 border-2",
                  complaintType === "fraud" ? "border-[#2A3B7D] bg-blue-50" : "border-gray-200",
                )}
                onClick={() => handleComplaintTypeSelect("fraud")}
              >
                <FileWarningIcon className="h-6 w-6" />
                <span>Fraud</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2 border-2",
                  complaintType === "vandalism" ? "border-[#2A3B7D] bg-blue-50" : "border-gray-200",
                )}
                onClick={() => handleComplaintTypeSelect("vandalism")}
              >
                <PaintRoller className="h-6 w-6" />
                <span>Vandalism</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2 border-2",
                  complaintType === "harassment" ? "border-[#2A3B7D] bg-blue-50" : "border-gray-200",
                )}
                onClick={() => handleComplaintTypeSelect("harassment")}
              >
                <Bell className="h-6 w-6" />
                <span>Harassment</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2 border-2",
                  complaintType === "other" ? "border-[#2A3B7D] bg-blue-50" : "border-gray-200",
                )}
                onClick={() => handleComplaintTypeSelect("other")}
              >
                <HelpCircle className="h-6 w-6" />
                <span>Other</span>
              </Button>
            </div>

          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2A3B7D]">Incident Details</h2>
            <p className="text-gray-600">Provide details about the incident.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  Description
                </Label>
                <textarea
                  id="description"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 50,
                      message: "Description must be at least 50 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  })}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md min-h-[150px]",
                    errors.description ? "border-red-500" : "border-gray-300",
                  )}
                  placeholder="Describe what happened in detail..."
                />
                <div className="flex justify-between text-sm">
                  <span className={description.length < 50 ? "text-red-500" : "text-gray-500"}>
                    {description.length}/500 characters
                  </span>
                  {description.length < 50 && <span className="text-red-500">Minimum 50 characters</span>}
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Add a button that will send a get request to get ai suggestions */}
              <Button
                type="button"
                variant="outline"
                className="text-sm text-gray-700"
                onClick={() => getAISuggestions(description,complaintType)}
              >
                Get AI Suggestions
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              {/* {aiSuggestions? <div>{aiSuggestions}</div>: <div>laudable</div>} */}

              {aiSuggestions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-gray-700">AI Suggestions</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">Date & Time</Label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isHappeningNow"
                      checked={isHappeningNow}
                      onChange={handleHappeningNowToggle}
                      className="mr-2"
                    />
                    <Label htmlFor="isHappeningNow" className="text-sm cursor-pointer">
                      Happening now?
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      id="incidentDate"
                      {...register("incidentDate", { required: "Date is required" })}
                      className={cn(
                        "w-full px-3 py-2 border rounded-md",
                        errors.incidentDate ? "border-red-500" : "border-gray-300",
                      )}
                      disabled={isHappeningNow}
                    />
                  </div>
                  <div>
                    <input
                      type="time"
                      id="incidentTime"
                      {...register("incidentTime", { required: "Time is required" })}
                      className={cn(
                        "w-full px-3 py-2 border rounded-md",
                        errors.incidentTime ? "border-red-500" : "border-gray-300",
                      )}
                      disabled={isHappeningNow}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2A3B7D]">Evidence Upload</h2>
            <p className="text-gray-600">Upload photos, videos, or documents related to the incident.</p>

            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50",
                  errors.evidence ? "border-red-500" : "border-gray-300",
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Drag & drop files here, or click to select files</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF, MP4 (Max 10 files)</p>
              </div>

              {errors.evidence && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.evidence.message}
                </p>
              )}

              {evidence.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Uploaded Files ({evidence.length}/10)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evidence.map((file: File, index: number) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : file.type.startsWith("video/") ? (
                                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                  <span className="text-xs">Video</span>
                                </div>
                              ) : (
                                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                  <span className="text-xs">File</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                              <select
                                className="mt-1 text-xs border border-gray-300 rounded px-2 py-1 w-full"
                                value={watch("evidenceTags")[index] || ""}
                                onChange={(e) => handleTagChange(index, e.target.value)}
                              >
                                <option value="">Select tag</option>
                                <option value="photo">Photo Evidence</option>
                                <option value="witness">Witness Report</option>
                                <option value="medical">Medical Document</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="consentAuthenticity"
                  {...register("consentAuthenticity", {
                    required: "You must confirm the authenticity of your evidence",
                  })}
                  className="mr-2"
                />
                <Label
                  htmlFor="consentAuthenticity"
                  className={cn(
                    "text-sm cursor-pointer",
                    errors.consentAuthenticity ? "text-red-500" : "text-gray-700",
                  )}
                >
                  I confirm that all evidence provided is authentic and accurate
                </Label>
              </div>
              {errors.consentAuthenticity && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.consentAuthenticity.message}
                </p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2A3B7D]">Location</h2>
            <p className="text-gray-600">Provide the location where the incident occurred.</p>

            <div className="space-y-4">
              <Button
                type="button"
                onClick={handleGetLocation}
                className="bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white w-full"
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting your location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Use My Current Location
                  </>
                )}
              </Button>

              <div className="h-[300px] border rounded-md overflow-hidden">
                {/* {typeof window !== "undefined" && (
                  <MapContainer
                    center={position || [51.505, -0.09]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                )} */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">
                  Address
                </Label>
                <input
                  type="text"
                  id="address"
                  {...register("location.address", { required: "Address is required" })}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md",
                    errors.location?.address ? "border-red-500" : "border-gray-300",
                  )}
                  placeholder="Enter the address or describe the location"
                />
                {errors.location?.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.location.address.message}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Click on the map to set the exact location or use the button above to use your current location.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2A3B7D]">Review & Submit</h2>
            <p className="text-gray-600">Review your complaint details before submitting.</p>

            {submissionSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Complaint Submitted Successfully!</h3>
                <p className="text-green-700 mb-4">Your complaint has been securely recorded on our blockchain.</p>
                <div className="bg-white border border-green-200 rounded-md p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Your Case ID</p>
                  <p className="text-2xl font-bold text-[#2A3B7D]">{caseId}</p>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  We've sent a confirmation with this case ID to your registered email and phone number.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white"
                    onClick={() => navigate('/dashboard')}
                  >Track Your Case</Button>
                  <Button variant="outline" className="border-[#2A3B7D] text-[#2A3B7D]" asChild>
                    <a href="/">Return to Home</a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-gray-800">Complaint Type</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-[#2A3B7D]"
                            onClick={() => setCurrentStep(1)}
                          >
                            Edit
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium">
                              {complaintType
                                ? complaintType.charAt(0).toUpperCase() + complaintType.slice(1)
                                : "Not specified"}
                            </p>
                          </div>
                          <div>
                            {/* <p className="text-sm text-gray-500">Subtype</p> */}
                            {/* <p className="font-medium">
                              {watch("complaintSubtype")
                                ? watch("complaintSubtype").charAt(0).toUpperCase() + watch("complaintSubtype").slice(1)
                                : "Not specified"}
                            </p> */}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-gray-800">Incident Details</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-[#2A3B7D]"
                            onClick={() => setCurrentStep(2)}
                          >
                            Edit
                          </Button>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-sm mt-1">{description || "No description provided"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{isHappeningNow ? "Now" : watch("incidentDate")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{isHappeningNow ? "Now" : watch("incidentTime")}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-gray-800">Evidence</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-[#2A3B7D]"
                            onClick={() => setCurrentStep(3)}
                          >
                            Edit
                          </Button>
                        </div>
                        {evidence.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {evidence.slice(0, 6).map((file: File, index: number) => (
                              <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                                {file.type.startsWith("image/") ? (
                                  <img
                                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs text-gray-500">
                                      {file.name.split(".").pop()?.toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                            {evidence.length > 6 && (
                              <div className="relative aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">+{evidence.length - 6} more</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No evidence uploaded</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-gray-800">Location</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-[#2A3B7D]"
                            onClick={() => setCurrentStep(4)}
                          >
                            Edit
                          </Button>
                        </div>
                        <p className="text-sm">{watch("location.address") || "Location not specified"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-800">
                    By submitting this complaint, you confirm that all information provided is accurate to the best of
                    your knowledge. False reporting may lead to legal consequences.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white"
                  disabled={isSubmitting}
                  onClick={(e) => { e.preventDefault(); handleSubmit(); }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>Submit Complaint</>
                  )}
                </Button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-[#2A3B7D]">File a Complaint</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#2A3B7D] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        {!submissionSuccess && currentStep !== 5 && (
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={currentStep === 1 ? "invisible" : ""}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              className="bg-[#2A3B7D] hover:bg-[#1e2a5a] text-white"
              disabled={
                (currentStep === 1 && (!complaintType)) ||
                (currentStep === 2 && description.length < 50) ||
                (currentStep === 3 && !watch("consentAuthenticity")) ||
                (currentStep === 4 && !watch("location.address"))
              }
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </FormProvider>
  )
}

export default ComplaintForm
