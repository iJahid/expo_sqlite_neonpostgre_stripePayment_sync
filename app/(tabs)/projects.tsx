import { Button, FlatList, Text, TextInput, View } from 'react-native';


import { fullSync } from '@/lib/fullSync';
import { useProjectsStore } from '@/store/useProjectsStore';
import { useUser } from '@clerk/expo';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { initDB } from "../../lib/db";

// ... inside your component
 
export default function Projects() {
 // verifyInstallation();
   const { user } = useUser();

  const { projects, loadProjects, addProject, deleteProject } = useProjectsStore()

useEffect(() => {
    initDB()
    if (user?.id) {
      loadProjects(user.id)
      fullSync(user.id)
    }
  }, [user])



  const [projectName, setProjectName] = useState("")

  return (
   <SafeAreaView className='flex-1 justify-center items-center gap-4'>
    <View className="flex-1 justify-center items-center gap-4">
    
    
      <TextInput
        placeholder="New Project"
        value={projectName}
        onChangeText={setProjectName}
      />
      <Button
        title="Add"
        onPress={() => {
          addProject(user!.id, projectName)
          setProjectName("")
         
        }}
      />

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>
              {item.projectName} 
            </Text>
            <Button title="X" onPress={() => deleteProject(item.id)} />
          </View>
        )}
      />
    </View>
   </SafeAreaView>
  );
}

