
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line } from "recharts";
import { ArrowUp, ArrowDown, RefreshCw, Bell, Users, Truck, Filter, Calendar, ChartBar } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataAnalyticsView } from '@/components/DataAnalyticsView';

// Mock data for demonstration
const shipmentVolumeData = [
  { name: "Jan", shipments: 12 },
  { name: "Feb", shipments: 19 },
  { name: "Mar", shipments: 15 },
  { name: "Apr", shipments: 27 },
  { name: "May", shipments: 24 },
  { name: "Jun", shipments: 32 },
];

const statusChartData = [
  { name: "Confirmed", value: 12 },
  { name: "Pickup", value: 5 },
  { name: "In Transit", value: 8 },
];

const leadConversionData = [
  { name: "New", value: 20 },
  { name: "Contacted", value: 14 },
  { name: "Qualified", value: 8 },
  { name: "Converted", value: 5 },
];

const agentActivityData = [
  { name: "Menfield", emails: 32, calls: 14 },
  { name: "AsiaTrade", emails: 24, calls: 8 },
  { name: "Express", emails: 18, calls: 11 },
];

const recentActivities = [
  { 
    id: 1,
    type: "status_update",
    description: "Shipment SH-002 status changed to In Transit",
    timestamp: "2 hours ago",
  },
  { 
    id: 2,
    type: "lead_conversion",
    description: "TechSupply converted to customer",
    timestamp: "4 hours ago",
  },
  { 
    id: 3,
    type: "new_shipment",
    description: "New shipment SH-004 created",
    timestamp: "1 day ago",
  },
  { 
    id: 4,
    type: "agent_contact",
    description: "Menfield contacted Global Imports Ltd.",
    timestamp: "2 days ago",
  },
];

// New data for Phase II
const monthlyRevenueData = [
  { name: "Jan", revenue: 35000 },
  { name: "Feb", revenue: 42000 },
  { name: "Mar", revenue: 38000 },
  { name: "Apr", revenue: 50000 },
  { name: "May", revenue: 55000 },
  { name: "Jun", revenue: 62000 },
];

const customerSatisfactionData = [
  { name: "Very Satisfied", value: 45 },
  { name: "Satisfied", value: 35 },
  { name: "Neutral", value: 15 },
  { name: "Unsatisfied", value: 5 },
];

const topRoutesData = [
  { name: "Shanghai-LA", value: 24 },
  { name: "Rotterdam-NY", value: 19 },
  { name: "Singapore-Seattle", value: 15 },
  { name: "Dubai-London", value: 12 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Index = () => {
  const [timeRange, setTimeRange] = useState("6m");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="finance">Financial</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">12%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Supplier Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">8%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lead Conversion Rate</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.6%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">2%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="text-xs text-muted-foreground">
                  Last updated 10 minutes ago
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Shipment Volume</CardTitle>
                <CardDescription>Total monthly shipments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[250px]" 
                  config={{
                    shipments: { color: "#8884d8" }
                  }}
                >
                  <AreaChart data={shipmentVolumeData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="shipments" 
                      name="Shipments"
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorShipments)" 
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shipment Status</CardTitle>
                <CardDescription>Current shipment status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[220px]"
                  config={{
                    status: { color: "#8884d8" }
                  }}
                >
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} shipments`, name]}
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                  </PieChart>
                </ChartContainer>
                <div className="mt-2">
                  <div className="flex flex-wrap justify-center gap-4">
                    {statusChartData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <span className="text-xs">{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lead Conversion Funnel</CardTitle>
                <CardDescription>Lead progression through sales stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[250px]"
                  config={{
                    leads: { color: "#8884d8" }
                  }}
                >
                  <BarChart data={leadConversionData} margin={{ top: 5, right: 30, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="Leads" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-muted bg-muted">
                          {activity.type === 'status_update' && <RefreshCw className="h-4 w-4" />}
                          {activity.type === 'lead_conversion' && <Users className="h-4 w-4" />}
                          {activity.type === 'new_shipment' && <Truck className="h-4 w-4" />}
                          {activity.type === 'agent_contact' && <Bell className="h-4 w-4" />}
                        </div>
                        <div className="h-full w-px bg-border" />
                      </div>
                      <div className="space-y-1 pt-1">
                        <p className="text-sm font-medium leading-none">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="shipments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Shipment Volume Trends</CardTitle>
                <CardDescription>Monthly shipment volume with growth trajectory</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[300px]" 
                  config={{
                    shipments: { color: "#8884d8" }
                  }}
                >
                  <LineChart data={shipmentVolumeData} margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="shipments" 
                      name="Shipments"
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Routes</CardTitle>
                <CardDescription>Most active shipping routes</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[250px]"
                  config={{
                    routes: { color: "#00C49F" }
                  }}
                >
                  <BarChart data={topRoutesData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="Shipments" fill="#00C49F" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Feedback from shipment recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[250px]"
                  config={{
                    satisfaction: { color: "#FFBB28" }
                  }}
                >
                  <PieChart>
                    <Pie
                      data={customerSatisfactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerSatisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                  </PieChart>
                </ChartContainer>
                <div className="mt-2">
                  <div className="flex flex-wrap justify-center gap-4">
                    {customerSatisfactionData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <span className="text-xs">{entry.name}: {entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[300px]" 
                  config={{
                    revenue: { color: "#82ca9d" }
                  }}
                >
                  <AreaChart data={monthlyRevenueData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#82ca9d" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <ChartBar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$282,000</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">15%</span>
                  <span className="ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Shipment Value</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,500</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">7%</span>
                  <span className="ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          <DataAnalyticsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
