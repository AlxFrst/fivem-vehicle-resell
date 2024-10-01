'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BugReportModal } from './BugReportModal'

export function FloatingBugButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsModalOpen(true)}
      >
        Signaler un bug
      </Button>
      <BugReportModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  )
}