"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  MoreHorizontal,
  UserPlus,
  Shield,
  Mail,
  Phone
} from "lucide-react"

export function UserManagement() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Mock users data
  const users = [
    {
      id: 1,
      name: "Ahmed Benali",
      email: "ahmed.benali@ormvao.ma",
      role: "agent",
      status: "active",
      phone: "+212 6 12 34 56 78",
      department: "Irrigation",
      lastLogin: "2024-01-15T10:30:00Z",
      createdAt: "2023-06-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Fatima Zahra",
      email: "fatima.zahra@ormvao.ma",
      role: "manager",
      status: "active",
      phone: "+212 6 98 76 54 32",
      department: "Formation",
      lastLogin: "2024-01-15T09:15:00Z",
      createdAt: "2023-05-15T00:00:00Z"
    },
    {
      id: 3,
      name: "Mohammed Alami",
      email: "mohammed.alami@ormvao.ma",
      role: "agent",
      status: "active",
      phone: "+212 6 55 44 33 22",
      department: "Équipement",
      lastLogin: "2024-01-14T16:45:00Z",
      createdAt: "2023-07-01T00:00:00Z"
    },
    {
      id: 4,
      name: "Amina Tazi",
      email: "amina.tazi@ormvao.ma",
      role: "admin",
      status: "active",
      phone: "+212 6 11 22 33 44",
      department: "Administration",
      lastLogin: "2024-01-15T08:00:00Z",
      createdAt: "2023-01-01T00:00:00Z"
    },
    {
      id: 5,
      name: "Hassan El Fassi",
      email: "hassan.elfassi@ormvao.ma",
      role: "agent",
      status: "inactive",
      phone: "+212 6 99 88 77 66",
      department: "Infrastructure",
      lastLogin: "2024-01-10T14:20:00Z",
      createdAt: "2023-08-01T00:00:00Z"
    }
  ]

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>
      case "agent":
        return <Badge className="bg-green-100 text-green-800">Agent</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === "all" || user?.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleDeleteUser = (user) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.name} ?`)) {
      // Here you would delete the user from your database
      console.log("Deleting user:", user.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez tous les utilisateurs du système</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un Utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte utilisateur
              </DialogDescription>
            </DialogHeader>
            <AddUserForm onSuccess={() => setIsAddUserOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, département..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière Connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user?.role)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.department}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(user.lastLogin).toLocaleDateString("fr-FR")}
                      <br />
                      <span className="text-muted-foreground">
                        {new Date(user.lastLogin).toLocaleTimeString("fr-FR")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'Utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm 
              user={selectedUser}
              onSuccess={() => setIsEditUserOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Add User Form Component
function AddUserForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would save the user to your database
    console.log("Adding new user:", formData)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom Complet</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Nom et prénom"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="email@ormvao.ma"
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Rôle</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="department">Département</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Irrigation">Irrigation</SelectItem>
              <SelectItem value="Formation">Formation</SelectItem>
              <SelectItem value="Équipement">Équipement</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+212 6 XX XX XX XX"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Créer l'Utilisateur
        </Button>
      </div>
    </form>
  )
}

// Edit User Form Component
function EditUserForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user?.role,
    department: user.department,
    phone: user.phone
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would update the user in your database
    console.log("Updating user:", formData)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom Complet</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Rôle</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="department">Département</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Irrigation">Irrigation</SelectItem>
              <SelectItem value="Formation">Formation</SelectItem>
              <SelectItem value="Équipement">Équipement</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Sauvegarder les Modifications
        </Button>
      </div>
    </form>
  )
} 