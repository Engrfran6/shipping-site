"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import { Building, Mail, Phone, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminUsersTable() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, typeFilter]);

  const fetchUsers = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_type", "client")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((user) => user.user_type === typeFilter);
    }

    setFilteredUsers(filtered);
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "client":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.full_name || "No name provided"}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        {user.company_name && (
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{user.company_name}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      {user.address && (
                        <p className="text-xs text-gray-500">
                          {user.address}, {user.city}, {user.state}{" "}
                          {user.postal_code}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getUserTypeColor(user.user_type)}>
                      {user.user_type.charAt(0).toUpperCase() +
                        user.user_type.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(user.is_active)}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <User className="h-8 w-8 mx-auto mb-2" />
            <p>No users found</p>
            {searchTerm || typeFilter !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
