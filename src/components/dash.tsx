
import {

  Cookie,
  Eye,
  MoreHorizontal,

} from "lucide-react"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bar, BarChart, ResponsiveContainer,RadialBarChart } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Nav } from "./nav"

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  AlignEndHorizontal,
  Users,
  Settings2,
  Save,
  ForkKnifeCrossed,
  Sparkles,
  RefreshCcw
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function Dashboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    allergies: '',
    preferences: '',
    gender: ''
  });
  const[save_data_email,set_save_email]=useState();
  useEffect(() => {
    // Check if the 'authToken' cookie exists
    const token = Cookies.get("email");
    handleRefresh();
    loadBMRDATA();
    if (!token) {
      // If cookie does not exist, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [allergies, setAllergies] = useState("");
  const [preferences, setPreferences] = useState("");
  const [active,setActive] = useState("")
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [mealData, setMealData] = useState(null);
  const [mealname,setmealname]=useState('')

  const [files, setFiles] = useState([]);


  const [meals, setMeals] = useState([]);

  const handleRefresh = async () => {
    try {
      // Fetch email from cookies
      const email = Cookies.get('email');
  
      if (!email) {
        return;
      }
  
      // Send email to API
      const response = await fetch('http://127.0.0.1:5000/get_files_by_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);  // Assuming data.files contains a list of filenames
      } else {
        alert('Failed to fetch data. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  
  // Function to fetch file content and open drawer
  const handleViewContent = async (filename: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_file_content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setFileContent(data.content); // Set file content to state
        setDrawerOpen(true);          // Open the drawer
      } else {
        alert('Failed to fetch file content.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  async function handleSaveMeals() {
    try {
      // Extract the suggested foods
      const suggestedFoods = mealData.suggested_foods;
      const mealNAME = (document.getElementById('mealNAME') as HTMLInputElement).value;

      if(mealNAME.trim()==''){
        alert("Please give a name")
      }else{
        // Send the data to the Python API
        const response = await fetch('http://127.0.0.1:5000/save_suggested_foods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            suggested_foods: suggestedFoods,
            email: Cookies.get('email'),
            nameMeal: mealNAME
          }),
        });
    
        // Check if the request was successful
        if (response.ok) {
          const result = await response.json();
          toast.success('Meal Saved Successfully', {
            style: {
              border: '1px solid #1cad2c',
              padding: '16px',
              color: '#159923',
            },
            iconTheme: {
              primary: '#1cad2c',
              secondary: '#b4f0ba',
            },
          });
            handleRefresh();
        } else {
          console.error('Failed to send data to Python API:', response.statusText);
        }

      }
    } catch (error) {
      toast("Failed save the meal", {
        icon: '⚠️',
        style: {
          borderRadius: '100vh',
          background: '#69262c',
          color: '#fff',
        },
      });
    }

  }
const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Capture the input values when the form is submitted
    const weight = (document.getElementById('weight') as HTMLInputElement).value;
    const height = (document.getElementById('height') as HTMLInputElement).value;
    const age = (document.getElementById('age') as HTMLInputElement).value;
    const gender = formData.gender;
    const allergies = (document.getElementById('allergies') as HTMLInputElement).value;
    const preferences = (document.getElementById('preferences') as HTMLInputElement).value;

    
    // Get the email cookie
    const email = Cookies.get("email");
  
    // Prepare the data to send
    const customizationData = {
      email,
      weight,
      height,
      age,
      gender,  // Added gender to the data being sent
      allergies,
      preferences,
    };
  
    try {
      const response = await fetch("http://localhost:3000/customization.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customizationData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success(result.message, {
          style: {
            border: '1px solid #1cad2c',
            padding: '16px',
            color: '#159923',
          },
          iconTheme: {
            primary: '#1cad2c',
            secondary: '#b4f0ba',
          },
        });
      } else {
        toast("Failed to customize. Try again !", {
          icon: '⚠️',
          style: {
            borderRadius: '100vh',
            background: '#69262c',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast("An error occurred. Try again !", {
        icon: '⚠️',
        style: {
          borderRadius: '100vh',
          background: '#69262c',
          color: '#fff',
        },
      });
    }
  };
  
  
  const loadData2Form = async () => {
    const token = Cookies.get("email");
    if (token) {
      try {
        const response = await fetch('http://localhost:3000/getPrefData.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        // Populate form data
        if (data.success) {
          setFormData({
            weight: data.weight || '',
            height: data.height || '',
            age: data.age || '',
            allergies: data.allergies || '',
            preferences: data.preferences || '',
            gender: data.gender || ''
          });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      return;
    }
  };

  const [formDataBMR, setFormDataBMR] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
  });

  const[usebmr,setbmr]=useState('')

  const handleGenerate = async () => {
    // Get the email from cookies
    const email = Cookies.get('email');
  
    if (!email) {
      return;
    }
  
    try {
      // Send the email to the PHP API to fetch user data
      const response = await fetch('http://localhost:3000/get_user_data.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const userData = await response.json();
  
      if (response.ok) {
        // Update the form with the fetched data
        setFormDataBMR({
          weight: userData.weight,
          height: userData.height,
          age: userData.age,
          gender: userData.gender,
        });
  
        // Now send the fetched data to the Flask API to get BMR
        const bmrResponse = await fetch('http://127.0.0.1:5000/calculate_bmr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gender: userData.gender,
            weight: userData.weight,
            height: userData.height,
            age: userData.age,
          }),
        });
  
        const bmrData = await bmrResponse.json();
        setbmr(bmrData.bmr);
        if (bmrResponse.ok) {
          const mealResponse = await fetch('http://127.0.0.1:5000/generate_meal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prefer: formData['preferences'],
              allergies: formData['allergies'],
              activeLevel: active,
              bmr: bmrData.bmr,
              age: userData.age,
            }),
          });
          
          const mealData = await mealResponse.json();
          
          
          if (mealResponse.ok) {
            toast.success('Meals generated successfully', {
              style: {
                border: '1px solid #1cad2c',
                padding: '16px',
                color: '#159923',
              },
              iconTheme: {
                primary: '#1cad2c',
                secondary: '#b4f0ba',
              },
            });
            setMealData(mealData);
            setPopupOpen(true);
          } else {
            toast("Failed to generate Meal. Try again !!", {
              icon: '⚠️',
              style: {
                borderRadius: '100vh',
                background: '#69262c',
                color: '#fff',
              },
            });
          }
          

        } else {
          toast("Failed to calculate BMR. Try again !!", {
            icon: '⚠️',
            style: {
              borderRadius: '100vh',
              background: '#69262c',
              color: '#fff',
            },
          });
        }
      } else {
        toast("Failed to fetch user data. Try again !", {
          icon: '⚠️',
          style: {
            borderRadius: '100vh',
            background: '#69262c',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching user data');
    }
  };
  
// Place the function at the top of your file, before it's used
function extractNameFromFilename(filename: string): string {
  // Assuming the filename structure is: email_name_suggested_foods.json
  const parts = filename.split('_');
  if (parts.length >= 2) {
    return parts[1]; // Extract the "name" part
  }
  return filename; // Fallback to return the whole filename if format doesn't match
}

const [searchTerm, setSearchTerm] = useState('');

// Filter the files based on the search input
const filteredFiles = files.filter((filename) =>
  extractNameFromFilename(filename).toLowerCase().includes(searchTerm.toLowerCase())
);



const loadBMRDATA = async()=>{
  const email = Cookies.get('email');
  
  if (!email) {
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/get_user_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const userData = await response.json();

    if (response.ok) {
      // Update the form with the fetched data
      setFormDataBMR({
        weight: userData.weight,
        height: userData.height,
        age: userData.age,
        gender: userData.gender,
      });

      // Now send the fetched data to the Flask API to get BMR
      const bmrResponse = await fetch('http://127.0.0.1:5000/calculate_bmr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender: userData.gender,
          weight: userData.weight,
          height: userData.height,
          age: userData.age,
        }),
      });

      const bmrData = await bmrResponse.json();
      setbmr(bmrData.bmr);
    }
  } catch (error) {
    console.log(error);
  }
}

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Nav/>
        <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Adjust and customize your character 
              </CardTitle>
              <Settings2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Character Customization</div>
              <Drawer>
                <DrawerTrigger><Button className="mt-5" variant='outline' onClick={loadData2Form}>
                  <AlignEndHorizontal className="h-4 w-4 mr-2"/>
                  Customize</Button></DrawerTrigger>
                <DrawerContent>
                <Card className="mx-auto max-w-sm mt-10">
                  <CardHeader>
                    <CardTitle className="text-xl">Character Customization</CardTitle>
                    <CardDescription>
                      Enter your information about current body parameters, desired goals, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="weight">Weight (Kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        
                        <Select  value={formData.gender} onValueChange={(value)=>{
                          setFormData({...formData, gender: value})
                        }}>
                          <SelectTrigger id='gender'>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Genders</SelectLabel>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="allergies">Allergies (separate by a comma)</Label>
                        <Input
                          id="allergies"
                          type="text"
                          value={formData.allergies}
                          onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="preferences">Food Preferences (separate by a comma)</Label>
                        <Input
                          id="preferences"
                          type="text"
                          value={formData.preferences}
                          onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                        />
                      </div>
                      <Button type="submit" onClick={handleSubmit} className="w-full">
                        Finish Customization
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              We will plan your meal according to your BMR, TDEE and your preferences.
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Plan your <span className="text-violet-400">Meal</span></div>
              <AlertDialog>
                <AlertDialogTrigger><Button className="mt-5" variant='outline' ><Sparkles className="mr-2 h2 w-4"></Sparkles> Generate</Button></AlertDialogTrigger>

                {isPopupOpen && mealData && (

<AlertDialog>
<br />
<br />
<hr />
  <AlertDialogTrigger><Button className="" variant='outline'><ForkKnifeCrossed className="mr-2 h-4 w-4"/>View</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle> Generated Meal</AlertDialogTitle>
      <AlertDialogDescription>
        <h1>Your BMR: <Badge>{usebmr}</Badge></h1>
        <br />
        <h1>Your TDEE: <Badge>{mealData.predicted_calorie_needs}</Badge></h1>
        <br />
        <h1>Total Calaries Count Of Suggested Food: <Badge>{mealData.total_calories}</Badge></h1>
        <br />
        <hr />
        <br />
      <Carousel className="w-[450px]">
            <CarouselContent>
              {mealData.suggested_foods.map((food, index) => (
                <CarouselItem key={index}>
                  <Card
                    className="relative bg-cover bg-center"
                    style={{ backgroundImage: `url(${food.image_link})`, backgroundSize: 'cover' }}
                  >
                    <CardContent className="flex flex-col items-left justify-center p-6 bg-black bg-opacity-80 text-white">
                      <h3 className="text-lg font-bold">{food.recipe_name}</h3>
                      <hr />
                      <p>Calories: {food.calories}</p>
                      <p>Carbs: {food.carbs}</p>
                      <p>Proteins: {food.proteins}</p>
                      <p>Serving Size: {food.serving_size}</p>
                      <p>Ingredients: {food.ingredients}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

)}

{isPopupOpen && mealData && (
              <AlertDialog>


              <AlertDialogTrigger><Button variant='outline' className="ml-2 mt-5" ><Save className=" h-4 w-4"/></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Do you want to save the meal?</AlertDialogTitle>
                  <AlertDialogDescription>
                  <Input type="email" placeholder="Meal Name" id='mealNAME'/>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSaveMeals}>Save</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
                )}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Select your activity level</AlertDialogTitle>
                    <AlertDialogDescription>
                    <Select onValueChange={(value)=>{setActive(value)}}>
                      <SelectTrigger >
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Active Scale</SelectLabel>
                          <SelectItem value="sedentary">Sedentary (Little or No Exercise)</SelectItem>
                          <SelectItem value="lightly">Lightly Active (Light Exercise/Sports 1-3 Days per Week)</SelectItem>
                          <SelectItem value="moderately">Moderately Active (Moderate Exercise/Sports 3-5 Days per Week)</SelectItem>
                          <SelectItem value="active">Very Active (Hard Exercise/Sports 6-7 Days per Week)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleGenerate}>Continue</AlertDialogAction>
                    
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <br />


            </CardContent>
          </Card>
          
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
  <CardHeader className="flex flex-row items-center">
    <div className="grid gap-2">
      <CardTitle>Saved Meals</CardTitle>
      <CardDescription>Recent meals that you have saved</CardDescription>
    </div>
    <Button asChild size="sm" className="ml-auto gap-1" variant='outline'>
      <Button onClick={handleRefresh} variant='outline'>
        Refresh
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </Button>
  </CardHeader>
  <CardContent>
    {/* Search Input */}
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
    </div>

    <ScrollArea className="h-72 rounded-md border">
          <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.map((filename, index) => (
            <TableRow key={index}>
              <TableCell>{extractNameFromFilename(filename)}</TableCell>
              <TableCell>
                <Button variant='outline' onClick={() => handleViewContent(filename)}>
                  <Eye className="w-4 h-4 mr-2"/> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
  <DrawerContent>
    <DrawerHeader>

    </DrawerHeader>

    <div className="p-4 flex justify-center items-center">
      {fileContent && fileContent.length > 0 ? (
        <Carousel className="w-[450px]">
          <CarouselContent>
            {fileContent.map((food, index) => (
              <CarouselItem key={index}>
                <Card
                  className="relative bg-cover bg-center"
                  style={{ backgroundImage: `url(${food.image_link})`, backgroundSize: 'cover' }}
                >
                  <CardContent className="flex flex-col items-left justify-center p-6 bg-black bg-opacity-80 text-white">
                    <h3 className="text-lg font-bold">{food.recipe_name}</h3>
                    <hr />
                    <p>Calories: {food.calories}</p>
                    <p>Carbs: {food.carbs}</p>
                    <p>Proteins: {food.proteins}</p>
                    <p>Serving Size: {food.serving_size}</p>
                    <p>Ingredients: {food.ingredients}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p>Loading...</p>
      )}
    </div>

    <DrawerFooter>
      <Button variant="outline" onClick={() => setDrawerOpen(false)}>
        Close
      </Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

    </ScrollArea>
  </CardContent>
</Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Statictics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Card className="p-5">
                <div className="text-center">
                <h1>BMR value</h1>
              <div className="text-7xl font-bold tracking-tighter">
                  {usebmr}
                </div>
                </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="goal"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>


  )
}
