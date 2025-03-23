import { useLocalSearchParams } from 'expo-router';
import { PixelRatio } from 'react-native';
import type { EditScreenParams } from '@/util/types';
import React, { useState } from 'react';
import { Text, Switch, View, useWindowDimensions } from 'react-native';
import {
  Canvas,
  useImage,
  Mask,
  Image,
  Skia,
  notifyChange,
  Path,
  SkPath,
  useCanvasRef,
  ImageFormat,
} from '@shopify/react-native-skia';
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { shareAsync } from 'expo-sharing';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Box,
  Button,
  ButtonText,
  HStack,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  Image as GlueStackImage,
  GluestackUIProvider
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

// import { EditorScreenPropType, PathWithWidth } from '../../types';
import { PathWithWidth } from '@/util/types';
// import { saveImageLocally, useUndoRedo } from '../Home/helpers';
import { saveImageLocally, useUndoRedo } from '@/util/helpers';



export default function EditScreen() {


  const { image, subject } = useLocalSearchParams<EditScreenParams>();
  const {width, height} = useWindowDimensions();
  const cutout = useImage(subject);
  const original = useImage(image);
  let oWidth = 0;
  let oHeight = 0;
  if(original){
    oWidth = original.width();
    oHeight = original.height();
  }
  const imageAspectRatio = oHeight / oWidth;
  const scale = PixelRatio.get();
  const canvasWidth = width;
  const canvasHeight = width * imageAspectRatio;
  console.log("canvas dimensions: ", canvasWidth, "x", canvasHeight);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(30);
  const [paths, undo, redo, setPaths, canUndo, canRedo] =
    useUndoRedo<PathWithWidth>([]);
  const currentPath = useSharedValue(Skia.Path.Make().moveTo(0, 0));
  const hasUpdatedPathState = useSharedValue(false);
  const isCurrentlyDrawing = useSharedValue(false);
  const isChangingBrushWidth = useSharedValue(false);
 
  const ref = useCanvasRef();

  const overlayX = useSharedValue(0);
  const overlayY = useSharedValue(0);
  const OVERLAY_WIDTH = 128;
  const offset = OVERLAY_WIDTH / 2;

  const onSave = async () => {
    const skiaImage = ref.current?.makeImageSnapshot();
    if (!skiaImage) return;

    const base64 = skiaImage.encodeToBase64(ImageFormat.PNG, 30);
    const fileUri = await saveImageLocally({
      fileName: 'updated-cutout.png',
      base64,
    });
    shareAsync(fileUri);
  };

  const updatePaths = (currentPathValue: SkPath) => {
    const newPath = {
      path: currentPathValue,
      blendMode: isDrawing ? 'color' : 'clear',
      strokeWidth,
      id: `${Date.now()}`,
    };
    setPaths([...paths, newPath]);
    currentPath.value = Skia.Path.Make().moveTo(0, 0);
    hasUpdatedPathState.value = true;
  };

  const onChangeBrushWidth = (value: number) => {
    isChangingBrushWidth.value = true;
    setStrokeWidth(value);
  };

  const onChangeBrushWidthEnd = () => {
    isChangingBrushWidth.value = false;
  };

  const tapDraw = Gesture.Tap().onEnd(e => {
    currentPath.value.moveTo(e.x, e.y).lineTo(e.x, e.y);
    notifyChange(currentPath);
    runOnJS(updatePaths)(currentPath.value);
  });

  const panDraw = Gesture.Pan()
    .averageTouches(true)
    .maxPointers(1)
    .onBegin(e => {
      if (hasUpdatedPathState.value) {
        hasUpdatedPathState.value = false;
        currentPath.value = Skia.Path.Make().moveTo(e.x, e.y);
      } else {
        currentPath.value.moveTo(e.x, e.y);
      }
      notifyChange(currentPath);
    })
    .onChange(e => {
      if (hasUpdatedPathState.value) {
        hasUpdatedPathState.value = false;
        currentPath.value = Skia.Path.Make().moveTo(e.x, e.y);
      } else {
        currentPath.value.lineTo(e.x, e.y);
      }

      isCurrentlyDrawing.value = true;
      overlayX.value = -e.x + offset;
      overlayY.value = -e.y + offset - canvasHeight;

      notifyChange(currentPath);
    })
    .onEnd(() => {
      isCurrentlyDrawing.value = false;
      runOnJS(updatePaths)(currentPath.value);
    });

  const composed = Gesture.Simultaneous(tapDraw, panDraw);

  const magnifyViewStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: overlayX.value }, { translateY: overlayY.value }],
  }));

  const overlayViewStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    width: OVERLAY_WIDTH,
    height: OVERLAY_WIDTH,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    opacity: isCurrentlyDrawing.value || isChangingBrushWidth.value ? 1 : 0,
  }));

  const pointerInOverlayStyle = useAnimatedStyle(() => ({
    width: strokeWidth,
    height: strokeWidth,
    top: OVERLAY_WIDTH / 2 - strokeWidth / 2,
    position: 'absolute',
    alignSelf: 'center',
  }));


  console.log("Image:", image);
  console.log("Subject:", subject);
  // console.log("Original:", original.width(), original.height());
  // console.log("Cutout:", cutout.width(), cutout.height());

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <GluestackUIProvider config={config}>
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: canvasHeight,
          width: canvasWidth,
          position: 'relative',
        }}
      >
        <GestureDetector gesture={composed}>
          <View>
            <GlueStackImage
              width={canvasWidth}
              height={canvasHeight}
              resizeMode="contain"
              source={{ uri: image }}
              alt="Background"
              position="absolute"
              opacity={0.2}
            />
            <Canvas
              style={{
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: 'transparent',
              }}
              ref={ref}
            >
              {original && cutout && (
                <Mask
                  mask={
                    <>
                      <Image
                        image={original}
                        fit="contain"
                        width={canvasWidth}
                        height={canvasHeight}
                      />
                      {paths.map(path => (
                        <Path
                          key={path.id}
                          path={path.path}
                          style="stroke"
                          strokeWidth={path.strokeWidth}
                          strokeCap="round"
                          blendMode={path.blendMode as any}
                          strokeJoin="round"
                        />
                      ))}
                      <Path
                        path={currentPath}
                        style="stroke"
                        strokeWidth={strokeWidth}
                        strokeCap="round"
                        blendMode={isDrawing ? 'color' : 'clear'}
                        strokeJoin="round"
                      />
                    </>
                  }
                >
                  <Image
                    image={cutout}
                    fit="contain"
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                  />
                </Mask>
              )}
            </Canvas>
          </View>
        </GestureDetector>
        <Animated.View style={overlayViewStyle}>
          <View style={{ width: canvasWidth, height: canvasHeight }} />
          <Animated.View style={magnifyViewStyle}>
            <GlueStackImage
              width={canvasWidth}
              height={canvasHeight}
              resizeMode="contain"
              source={{ uri: image }}
              alt="Background"
              position="absolute"
              opacity={0.2}
            />
            <Canvas
              style={{
                width: canvasWidth,
                height: canvasHeight,
                backgroundColor: 'transparent',
              }}
            >
              {original && cutout && (
                <Mask
                  mask={
                    <>
                      <Image
                        image={original}
                        fit="contain"
                        width={canvasWidth}
                        height={canvasHeight}
                      />
                      {paths.map(path => (
                        <Path
                          key={path.id}
                          path={path.path}
                          style="stroke"
                          strokeWidth={path.strokeWidth}
                          strokeCap="round"
                          blendMode={path.blendMode as any}
                          strokeJoin="round"
                        />
                      ))}
                      <Path
                        path={currentPath}
                        style="stroke"
                        strokeWidth={strokeWidth}
                        strokeCap="round"
                        blendMode={isDrawing ? 'color' : 'clear'}
                        strokeJoin="round"
                      />
                    </>
                  }
                >
                  <Image
                    image={cutout}
                    fit="contain"
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                  />
                </Mask>
              )}
            </Canvas>
          </Animated.View>
          <Animated.View style={pointerInOverlayStyle}>
            <View
              style={{
                borderColor: 'blue',
                borderWidth: 3,
                borderStyle: 'dashed',
                width: strokeWidth,
                height: strokeWidth,
                borderRadius: strokeWidth,
                backgroundColor: '#ffffff73',
              }}
            />
          </Animated.View>
        </Animated.View>
      </View>
      <VStack mx={20} space="md">
        <HStack justifyContent="space-between" mt={20}>
          <HStack space="sm" alignItems="center">
            <Text>Erase</Text>
            <Switch value={isDrawing} onValueChange={setIsDrawing} />
            <Text>Draw</Text>
          </HStack>
          <HStack space="sm">
            <Button onPress={undo} disabled={!canUndo} bgColor="$coolGray300">
              <Icon as={ArrowLeftIcon} />
            </Button>
            <Button onPress={redo} disabled={!canRedo} bgColor="$coolGray300">
              <Icon as={ArrowRightIcon} />
            </Button>
          </HStack>
        </HStack>
        <Box>
          <Text>Brush width</Text>
          <Slider
            defaultValue={strokeWidth}
            size="md"
            orientation="horizontal"
            onChange={onChangeBrushWidth}
            onChangeEnd={onChangeBrushWidthEnd}
            mt={10}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Button onPress={onSave} mt={20}>
          <ButtonText>Save image</ButtonText>
        </Button>
      </VStack>
    </View>
  
  </GluestackUIProvider>
  </GestureHandlerRootView>
  );
}
