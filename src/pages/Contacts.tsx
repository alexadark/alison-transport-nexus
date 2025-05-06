
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useContacts } from '@/hooks/use-contacts';

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [newContact, setNewContact] = useState({
    contact_name: '',
    company_name: '',
    contact_type: 'Agent',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);

  // Use our custom hook to fetch contacts
  const { data: contacts = [], isLoading, error } = useContacts(searchQuery);

  // Handle errors
  if (error) {
    console.error('Error loading contacts:', error);
  }

  const handleAddContact = async () => {
    if (!newContact.contact_name || !newContact.email || !newContact.company_name) {
      toast.error("Please fill out the required fields");
      return;
    }
    
    try {
      // Insert the new contact into Supabase
      const { data, error } = await supabase
        .from('contacts')
        .insert(newContact)
        .select();
      
      if (error) throw error;
      
      toast.success("Contact added successfully");
      setIsAddDialogOpen(false);
      setNewContact({
        contact_name: '',
        company_name: '',
        contact_type: 'Agent',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
      });
    } catch (err) {
      console.error('Error adding contact:', err);
      toast.error("Failed to add contact");
    }
  };

  const viewContact = (id: string) => {
    setSelectedContactId(id);
    setIsViewDialogOpen(true);
  };

  const selectedContact = selectedContactId 
    ? contacts.find(contact => contact.id === selectedContactId) 
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-status-transit hover:bg-status-transit/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add a new contact to your contacts list. Fill in the required information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name*
                </label>
                <Input
                  id="name"
                  value={newContact.contact_name}
                  onChange={(e) => setNewContact({...newContact, contact_name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="company" className="text-right">
                  Company*
                </label>
                <Input
                  id="company"
                  value={newContact.company_name}
                  onChange={(e) => setNewContact({...newContact, company_name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right">
                  Type
                </label>
                <select
                  id="type"
                  value={newContact.contact_type}
                  onChange={(e) => setNewContact({...newContact, contact_type: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Agent">Agent</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email*
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="address" className="text-right">
                  Address
                </label>
                <Input
                  id="address"
                  value={newContact.address}
                  onChange={(e) => setNewContact({...newContact, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="city" className="text-right">
                  City
                </label>
                <Input
                  id="city"
                  value={newContact.city}
                  onChange={(e) => setNewContact({...newContact, city: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="country" className="text-right">
                  Country
                </label>
                <Input
                  id="country"
                  value={newContact.country}
                  onChange={(e) => setNewContact({...newContact, country: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-status-transit hover:bg-status-transit/90" onClick={handleAddContact}>
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
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
                  <Button variant="outline" size="sm" onClick={() => viewContact(contact.id)}>View</Button>
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
                    <span>{contact.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" />
                    <span>
                      {[contact.address, contact.city, contact.country].filter(Boolean).join(', ') || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No contacts found</p>
        </div>
      )}

      {/* View contact dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Name:</span>
                <span className="col-span-2">{selectedContact.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Company:</span>
                <span className="col-span-2">{selectedContact.company}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Type:</span>
                <span className="col-span-2">{selectedContact.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Email:</span>
                <span className="col-span-2">{selectedContact.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Phone:</span>
                <span className="col-span-2">{selectedContact.phone || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Address:</span>
                <span className="col-span-2">
                  {[selectedContact.address, selectedContact.city, selectedContact.country].filter(Boolean).join(', ') || 'N/A'}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
