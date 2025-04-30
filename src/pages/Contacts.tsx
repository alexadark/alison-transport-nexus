
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Search, Plus, Phone, Mail, MapPin } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  company: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

// Mock data for demonstration
const mockContacts: Contact[] = [
  {
    id: 'C-001',
    name: 'Sarah Johnson',
    company: 'Menfield',
    type: 'Agent',
    email: 'sarah@menfield.com',
    phone: '+1 555-123-4567',
    address: '123 Logistics Way',
    city: 'Chicago',
    country: 'USA',
  },
  {
    id: 'C-002',
    name: 'John Miller',
    company: 'Menfield',
    type: 'Agent',
    email: 'john@menfield.com',
    phone: '+1 555-987-6543',
    address: '123 Logistics Way',
    city: 'Chicago',
    country: 'USA',
  },
  {
    id: 'C-003',
    name: 'Robert Johnson',
    company: 'Dome Parts Inc.',
    type: 'Supplier',
    email: 'r.johnson@domeparts.com',
    phone: '+1 555-456-7890',
    address: '456 Industrial Ave',
    city: 'Seattle',
    country: 'USA',
  },
  {
    id: 'C-004',
    name: 'Jennifer Lee',
    company: 'TechSupply Inc.',
    type: 'Supplier',
    email: 'j.lee@techsupply.com',
    phone: '+1 555-789-0123',
    address: '789 Tech Blvd',
    city: 'Chicago',
    country: 'USA',
  },
  {
    id: 'C-005',
    name: 'Michael Roberts',
    company: 'QuickShip Parts',
    type: 'Supplier',
    email: 'm.roberts@quickship.com',
    phone: '+1 555-234-5678',
    address: '321 Shipping Lane',
    city: 'Dallas',
    country: 'USA',
  },
  {
    id: 'C-006',
    name: 'David Chen',
    company: 'AsiaTrade',
    type: 'Agent',
    email: 'david@asiatrade.com',
    phone: '+852 5555-8888',
    address: '88 Harbor Road',
    city: 'Hong Kong',
    country: 'China',
  },
];

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredContacts = mockContacts.filter((contact) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.type.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.city.toLowerCase().includes(query) ||
      contact.country.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button className="bg-status-transit hover:bg-status-transit/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="relative max-w-md mx-auto md:mx-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          className="pl-9" 
          placeholder="Search contacts..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{contact.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    {contact.company}
                    <span className="ml-2 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                      {contact.type}
                    </span>
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" />
                  <span>
                    {contact.address}, {contact.city}, {contact.country}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
