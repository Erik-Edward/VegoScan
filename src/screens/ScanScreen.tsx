import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Camera, CameraPermissionStatus, useCameraDevices, CameraDevice } from 'react-native-vision-camera';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { extractTextFromImage } from '../services/ocrService';
import { analyzeIngredients } from '../services/claudeService';
import Animated, { useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

type ScanScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scan'>;
};

export function ScanScreen({ navigation }: ScanScreenProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanningState, setScanningState] = useState<'ready' | 'scanning' | 'processing'>('ready');
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find((d): d is CameraDevice => d.position === 'back');

  // Animerad scanningslinje
  const scanLineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: withRepeat(
        withTiming(200, { duration: 2000 }),
        -1,
        true
      ),
    }],
  }));

  React.useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    })();
  }, []);

  const handleCapture = async () => {
    try {
      setScanningState('scanning');
      setIsProcessing(true);
      
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
      });

      setScanningState('processing');
      
      const extractedText = await extractTextFromImage(photo.path);
      console.log('Extracted text:', extractedText);
      
      const analysisResult = await analyzeIngredients(extractedText);
      
      navigation.navigate('Result', {
        isVegan: analysisResult.isVegan,
        ingredients: analysisResult.ingredients,
        explanation: analysisResult.explanation
      });
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert(
        'Fel',
        error instanceof Error ? error.message : 'Ett fel uppstod vid analys av bilden. Försök igen.'
      );
    } finally {
      setIsProcessing(false);
      setScanningState('ready');
    }
  };

  const renderScanOverlay = () => (
    <View style={styles.scanOverlay}>
      <View style={styles.scanArea}>
        <Animated.View style={[styles.scanLine, scanLineAnimatedStyle]} />
        {scanningState === 'processing' && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.processingText}>Analyserar ingredienser...</Text>
          </View>
        )}
      </View>
      <Text style={styles.instructions}>
        {scanningState === 'ready' 
          ? 'Placera ingredienslistan inom ramen'
          : scanningState === 'scanning'
          ? 'Håll kameran stilla...'
          : 'Analyserar...'}
      </Text>
    </View>
  );

  if (!hasPermission) return (
    <View style={styles.container}>
      <Text style={styles.warningText}>Behörighet till kameran saknas</Text>
    </View>
  );

  if (!device) return (
    <View style={styles.container}>
      <Text style={styles.warningText}>Laddar kamera...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      {renderScanOverlay()}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[
            styles.captureButton,
            isProcessing && styles.captureButtonDisabled
          ]}
          onPress={handleCapture}
          disabled={isProcessing}
        >
          <Text style={styles.captureText}>
            {isProcessing ? 'Analyserar...' : 'Ta Bild'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.3,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scanLine: {
    height: 2,
    backgroundColor: '#4CAF50',
    width: '100%',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
  },
  captureButtonDisabled: {
    backgroundColor: '#888',
  },
  captureText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
});