import React, { useContext } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { LocalizationContext } from 'contexts/Localization'
import { listItemActionButtonColor } from 'utils/constants'

interface SwipeableListItemProps {
  child?: React.ReactNode
  editAction?: () => void
  deleteAction?: () => void
}

const SwipeableListItem: React.FC<SwipeableListItemProps> = (props) => {
  const { t } = useContext(LocalizationContext)
  const ListItemRightActions = (
    progress: Animated.AnimatedInterpolation,
    _dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    const transEdit = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [160, 0]
    })
    const transDelete = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0]
    })
    return (
      <View style={styles.listItemRightActionsContainer}>
        <Animated.View
          style={{
            ...styles.listItemAction,
            transform: [{ translateX: transEdit }]
          }}
        >
          <RectButton
            style={styles.listItemEditAction}
            onPress={props.editAction}
          >
            <Text style={styles.listItemActionText}>
              {t('common.button.edit').toUpperCase()}
            </Text>
          </RectButton>
        </Animated.View>
        <Animated.View
          style={{
            ...styles.listItemAction,
            transform: [{ translateX: transDelete }]
          }}
        >
          <RectButton
            style={styles.listItemDeleteAction}
            onPress={props.deleteAction}
          >
            <Text style={styles.listItemActionText}>
              {t('common.button.delete').toUpperCase()}
            </Text>
          </RectButton>
        </Animated.View>
      </View>
    )
  }

  return (
    <Swipeable
      friction={1.5}
      rightThreshold={40}
      renderRightActions={
        (props.editAction || props.deleteAction) && ListItemRightActions
      }
    >
      {props.children}
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  listItemRightActionsContainer: {
    width: 160,
    flexDirection: 'row'
  },
  listItemAction: {
    flex: 1
  },
  listItemEditAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: listItemActionButtonColor.edit
  },
  listItemDeleteAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: listItemActionButtonColor.delete
  },
  listItemActionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent'
  }
})

export default SwipeableListItem
