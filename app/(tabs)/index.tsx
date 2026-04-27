import { Button, FlatList, Text, TextInput, View } from 'react-native';


import { fullSync } from '@/lib/fullSync';
import { useNotesStore } from '@/store/useNotesStore';
import { useUser } from '@clerk/expo';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { initDB } from "../../lib/db";

// ... inside your component
 
export default function HomeScreen() {
 // verifyInstallation();
   const { user } = useUser();

 

useEffect(() => {
    initDB()
    if (user?.id) {
      loadNotes(user.id)
      fullSync(user.id)
    }
  }, [user])


 const { notes, loadNotes, addNote, deleteNote } = useNotesStore()
  const [title, setTitle] = useState("")

  return (
   <SafeAreaView className='flex-1 justify-center items-center gap-4'>
    <View className="flex-1 justify-center items-center gap-4">
      <Text className="text-2xl font-bold text-cool-gray-800">Welcome to MyWallet!</Text>
      <Text className='text-3xl text-blue-500'>Hello {user?.firstName || ""} {user?.lastName || ""}</Text>
      <Text className='text-lg text-cool-gray-600'> {user?.emailAddresses[0]?.emailAddress || ""}</Text>
    
      <TextInput
        placeholder="New Note"
        value={title}
        onChangeText={setTitle}
      />
      <Button
        title="Add"
        onPress={() => {
          addNote(user!.id, title)
          setTitle("")
         
        }}
      />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>
              {item.title} 
            </Text>
            <Button title="X" onPress={() => deleteNote(item.id)} />
          </View>
        )}
      />
    </View>
   </SafeAreaView>
  );
}

