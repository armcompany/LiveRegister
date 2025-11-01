import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from "react-native-image-picker";
import { supabase } from "~/services/supabaseClient";
import IonIcon from "react-native-vector-icons/Ionicons";

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 10,
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      const fileExt = uri.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `equipment/${fileName}`;

      // Create FormData for React Native
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        name: fileName,
        type: `image/${fileExt}`,
      } as any);

      const { data, error } = await supabase.storage
        .from("image")
        .upload(filePath, formData, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("image").getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert("Erro", `Falha ao fazer upload: ${error.message}`);
      return null;
    }
  };

  const handleImagePicker = async (source: "camera" | "library") => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        "Limite atingido",
        `Máximo de ${maxPhotos} fotos permitidas.`
      );
      return;
    }

    const options = {
      mediaType: "photo" as const,
      quality: 0.8 as const,
      maxWidth: 1920,
      maxHeight: 1920,
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert(
          "Erro",
          response.errorMessage || "Erro ao selecionar imagem"
        );
        return;
      }

      if (response.assets && response.assets[0].uri) {
        handleUpload(response.assets[0].uri);
      }
    };

    if (source === "camera") {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  const handleUpload = async (uri: string) => {
    setUploading(true);
    const url = await uploadImage(uri);
    if (url) {
      onPhotosChange([...photos, url]);
    }
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    Alert.alert("Remover foto", "Deseja remover esta foto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          const newPhotos = photos.filter((_, i) => i !== index);
          onPhotosChange(newPhotos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Fotos ({photos.length}/{maxPhotos})
      </Text>

      {photos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosContainer}
        >
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {photos.length < maxPhotos && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePicker("camera")}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>Tirar Foto</Text>
            <View style={{ height: 8 }} />
            <IonIcon name="camera" size={20} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePicker("library")}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>Galeria</Text>
            <View style={{ height: 8 }} />
            <IonIcon name="image" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      )}

      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.uploadingText}>Enviando foto...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  photosContainer: {
    marginBottom: 12,
  },
  photoWrapper: {
    position: "relative",
    marginRight: 12,
    paddingVertical: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: -8,
    backgroundColor: "#726161ff",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  uploadingText: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default PhotoUploader;
