
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip, LineChart, Line, Scatter, ScatterChart, ZAxis } from "recharts";

// Mock data for analytics
const performanceData = [
  { date: "2025-01", deliveryTime: 3.2, satisfactionScore: 8.5, volume: 15 },
  { date: "2025-02", deliveryTime: 3.1, satisfactionScore: 8.7, volume: 18 },
  { date: "2025-03", deliveryTime: 3.3, satisfactionScore: 8.3, volume: 14 },
  { date: "2025-04", deliveryTime: 2.9, satisfactionScore: 9.0, volume: 22 },
  { date: "2025-05", deliveryTime: 2.8, satisfactionScore: 9.1, volume: 24 },
  { date: "2025-06", deliveryTime: 2.7, satisfactionScore: 9.2, volume: 27 },
];

const distributionData = [
  { weight: "0-100kg", count: 45 },
  { weight: "101-500kg", count: 32 },
  { weight: "501-1000kg", count: 18 },
  { weight: "1001-5000kg", count: 8 },
  { weight: "5000kg+", count: 3 },
];

const correlationData = [
  { shipmentSize: 100, cost: 500, deliveryTime: 2 },
  { shipmentSize: 200, cost: 750, deliveryTime: 2.5 },
  { shipmentSize: 500, cost: 1200, deliveryTime: 3 },
  { shipmentSize: 1000, cost: 2000, deliveryTime: 3.5 },
  { shipmentSize: 2000, cost: 3500, deliveryTime: 4 },
  { shipmentSize: 3000, cost: 5000, deliveryTime: 4.5 },
  { shipmentSize: 5000, cost: 7500, deliveryTime: 5 },
];

const regionData = [
  { region: "Asia", revenue: 120000, shipments: 425 },
  { region: "Europe", revenue: 95000, shipments: 310 },
  { region: "North America", revenue: 85000, shipments: 275 },
  { region: "South America", revenue: 45000, shipments: 180 },
  { region: "Africa", revenue: 25000, shipments: 95 },
  { region: "Oceania", revenue: 32000, shipments: 125 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const DataAnalyticsView = () => {
  const [analyticsType, setAnalyticsType] = useState("performance");
  const [timeFrame, setTimeFrame] = useState("6m");
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Advanced Analytics</h2>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={analyticsType} onValueChange={setAnalyticsType} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Over Time</CardTitle>
              <CardDescription>Key performance indicators and their trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                className="h-[350px]"
                config={{
                  deliveryTime: { color: "#8884d8" },
                  satisfactionScore: { color: "#82ca9d" }
                }}
              >
                <LineChart 
                  data={performanceData}
                  margin={{ top: 5, right: 30, bottom: 5, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="deliveryTime" 
                    name="Avg. Delivery Time (days)"
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="satisfactionScore" 
                    name="Satisfaction Score (0-10)"
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Weight Distribution</CardTitle>
              <CardDescription>Distribution of shipments by weight category</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                className="h-[350px]"
                config={{
                  count: { color: "#FF8042" }
                }}
              >
                <BarChart
                  data={distributionData}
                  margin={{ top: 5, right: 30, bottom: 5, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weight" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" name="Number of Shipments" fill="#FF8042" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost vs. Size Correlation</CardTitle>
              <CardDescription>Relationship between shipment size, cost, and delivery time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                className="h-[350px]"
                config={{
                  correlation: { color: "#FFBB28" }
                }}
              >
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="shipmentSize" 
                    name="Shipment Size (kg)" 
                    unit="kg" 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="cost" 
                    name="Cost" 
                    unit="$" 
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="deliveryTime" 
                    range={[60, 200]} 
                    name="Delivery Time" 
                    unit=" days" 
                  />
                  <ChartTooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter 
                    name="Shipments" 
                    data={correlationData} 
                    fill="#FFBB28" 
                  />
                </ScatterChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Region</CardTitle>
                <CardDescription>Revenue distribution across geographical regions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[300px]"
                  config={{
                    revenue: { color: "#0088FE" }
                  }}
                >
                  <BarChart
                    data={regionData}
                    margin={{ top: 5, right: 30, bottom: 5, left: 20 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="region" />
                    <ChartTooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shipments by Region</CardTitle>
                <CardDescription>Shipment volume distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  className="h-[300px]"
                  config={{
                    shipments: { color: "#00C49F" }
                  }}
                >
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#00C49F"
                      dataKey="shipments"
                      nameKey="region"
                    >
                      {regionData.map((entry, index) => (
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
                    {regionData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <span className="text-xs">{entry.region}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
