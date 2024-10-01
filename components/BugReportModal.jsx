'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sendBugReport } from '@/app/actions'

export function BugReportModal({ isOpen, setIsOpen }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [bugType, setBugType] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await sendBugReport({ title, description, bugType })
    setIsOpen(false)
    setTitle('')
    setDescription('')
    setBugType('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler un bug</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="bugType">Type de bug</Label>
              <Select onValueChange={setBugType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de bug" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interface">Interface</SelectItem>
                  <SelectItem value="fonctionnalité">Fonctionnalité</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Envoyer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}