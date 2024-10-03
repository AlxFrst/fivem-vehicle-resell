import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CollaboratorsModal({ isOpen, setIsOpen, catalog, addCollaborator, removeCollaborator, searchUsers }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState('editor');

    const handleSearch = async () => {
        if (searchTerm.trim() !== '') {
            const results = await searchUsers(searchTerm);
            setSearchResults(results);
        }
    };

    const handleAddCollaborator = async () => {
        if (selectedUser) {
            await addCollaborator(catalog.id, selectedUser.email, role);
            setSelectedUser(null);
            setSearchTerm('');
            setSearchResults([]);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Gérer les collaborateurs</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un utilisateur par email"
                        />
                        <Button onClick={handleSearch}>Rechercher</Button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="space-y-2">
                            <p>Résultats de la recherche :</p>
                            {searchResults.map(user => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <span>{user.name} ({user.email})</span>
                                    <Button onClick={() => setSelectedUser(user)}>Sélectionner</Button>
                                </div>
                            ))}
                        </div>
                    )}
                    {selectedUser && (
                        <div className="flex items-center space-x-2">
                            <span>{selectedUser.name} ({selectedUser.email})</span>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sélectionner un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="editor">Éditeur</SelectItem>
                                    <SelectItem value="viewer">Observateur</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddCollaborator}>Ajouter</Button>
                        </div>
                    )}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {catalog.collaborators.map((collab) => (
                                <TableRow key={collab.id}>
                                    <TableCell>{collab.user.name}</TableCell>
                                    <TableCell>{collab.user.email}</TableCell>
                                    <TableCell>{collab.role}</TableCell>
                                    <TableCell>
                                        <Button variant="destructive" onClick={() => removeCollaborator(collab.id)}>
                                            Supprimer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}