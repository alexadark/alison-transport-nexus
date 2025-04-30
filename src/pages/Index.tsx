
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ArrowUp, ArrowDown, RefreshCw, Bell, Users, Truck } from 'lucide-react';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
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
    </div>
  );
};

export default Index;
