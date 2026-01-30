import React from 'react'
import { KeyboardAvoidingView } from 'react-native'

export default function KeyboardAvoidingWrapper({children}: {children: React.ReactNode}) {
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  )
}