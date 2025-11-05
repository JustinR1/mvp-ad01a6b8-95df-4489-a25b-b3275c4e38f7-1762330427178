import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
  Appearance,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Modal from './components/Modal';
import Button from './components/Button';
import Toast from './components/Toast';

interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  rating: number;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      items: [
        { id: 1, name: 'Wireless Headphones', price: 129.99, emoji: '🎧', rating: 4.5, category: 'Electronics', description: 'Premium sound quality', quantity: 1 }
      ],
      total: 129.99,
      status: 'delivered'
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      items: [
        { id: 2, name: 'Smart Watch', price: 299.99, emoji: '⌚', rating: 4.8, category: 'Electronics', description: 'Track your fitness', quantity: 1 }
      ],
      total: 299.99,
      status: 'shipped'
    }
  ]);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as const });

  const products: Product[] = [
    { id: 1, name: 'Wireless Headphones', price: 129.99, emoji: '🎧', rating: 4.5, category: 'Electronics', description: 'Premium sound quality with noise cancellation' },
    { id: 2, name: 'Smart Watch', price: 299.99, emoji: '⌚', rating: 4.8, category: 'Electronics', description: 'Track your fitness and health goals' },
    { id: 3, name: 'Laptop Stand', price: 49.99, emoji: '💻', rating: 4.2, category: 'Accessories', description: 'Ergonomic aluminum stand for better posture' },
    { id: 4, name: 'USB-C Cable', price: 19.99, emoji: '🔌', rating: 4.6, category: 'Accessories', description: 'Fast charging and data transfer' },
    { id: 5, name: 'Wireless Mouse', price: 39.99, emoji: '🖱️', rating: 4.4, category: 'Accessories', description: 'Precision tracking and comfortable grip' },
    { id: 6, name: 'Mechanical Keyboard', price: 149.99, emoji: '⌨️', rating: 4.7, category: 'Electronics', description: 'RGB backlit with tactile switches' },
    { id: 7, name: 'Phone Case', price: 24.99, emoji: '📱', rating: 4.3, category: 'Accessories', description: 'Durable protection with sleek design' },
    { id: 8, name: 'Portable Charger', price: 59.99, emoji: '🔋', rating: 4.5, category: 'Electronics', description: 'High capacity power bank for on-the-go' },
  ];

  const colors = {
    background: isDark ? '#000000' : '#F9FAFB',
    surface: isDark ? '#1C1C1E' : '#FFFFFF',
    surfaceSecondary: isDark ? '#2C2C2E' : '#F2F2F7',
    text: isDark ? '#FFFFFF' : '#1C1C1E',
    textSecondary: isDark ? '#8E8E93' : '#8E8E93',
    border: isDark ? '#38383A' : '#E5E5EA',
    primary: isDark ? '#0A84FF' : '#FF9500',
    accent: isDark ? '#FF9F0A' : '#FF9500',
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const addToCart = (product: Product) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      showToast('Quantity updated in cart', 'success');
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      showToast('Added to cart', 'success');
    }
  };

  const removeFromCart = (productId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCart(cart.filter(item => item.id !== productId));
    showToast('Removed from cart', 'info');
  };

  const updateQuantity = (productId: number, change: number) => {
    Haptics.selectionAsync();
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      total: getTotalPrice(),
      status: 'pending'
    };
    
    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowCart(false);
    showToast('Order placed successfully!', 'success');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'processing': return '#007AFF';
      case 'shipped': return '#5856D6';
      case 'delivered': return '#34C759';
    }
  };

  const getStatusIcon = (status: Order['status']): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'processing': return 'sync-outline';
      case 'shipped': return 'airplane-outline';
      case 'delivered': return 'checkmark-circle-outline';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Shop</Text>
          <View style={styles.themeToggle}>
            <Ionicons name="moon" size={16} color={colors.textSecondary} />
            <Switch
              value={isDark}
              onValueChange={(value) => {
                Haptics.selectionAsync();
                Appearance.setColorScheme(value ? 'dark' : 'light');
              }}
              trackColor={{ false: '#E5E5EA', true: colors.primary }}
              thumbColor="#FFFFFF"
              style={styles.switch}
            />
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowOrders(true);
            }}
          >
            <Ionicons name="receipt-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowCart(true);
            }}
          >
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {getTotalItems() > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Discover our best sellers</Text>
        </View>

        {products.map(product => (
          <View key={product.id} style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.productEmoji, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={styles.emoji}>{product.emoji}</Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
              <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={1}>
                {product.description}
              </Text>
              <View style={styles.productFooter}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={[styles.rating, { color: colors.textSecondary }]}>{product.rating}</Text>
                </View>
                <Text style={[styles.price, { color: colors.accent }]}>${product.price.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => addToCart(product)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        onClose={() => setShowCart(false)}
        title="Shopping Cart"
      >
        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>Add some products to get started</Text>
          </View>
        ) : (
          <>
            <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
              {cart.map(item => (
                <View key={item.id} style={[styles.cartItem, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                  <View style={[styles.cartItemEmoji, { backgroundColor: colors.surface }]}>
                    <Text style={styles.cartItemEmojiText}>{item.emoji}</Text>
                  </View>
                  <View style={styles.cartItemInfo}>
                    <Text style={[styles.cartItemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.cartItemPrice, { color: colors.accent }]}>${item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.cartItemActions}>
                    <View style={[styles.quantityControl, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, -1)}
                        style={styles.quantityButton}
                      >
                        <Ionicons name="remove" size={16} color={colors.text} />
                      </TouchableOpacity>
                      <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 1)}
                        style={styles.quantityButton}
                      >
                        <Ionicons name="add" size={16} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={[styles.cartFooter, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total ({getTotalItems()} items)</Text>
                <Text style={[styles.totalPrice, { color: colors.text }]}>${getTotalPrice().toFixed(2)}</Text>
              </View>
              <Button
                title="Checkout"
                onPress={handleCheckout}
                variant="primary"
                size="large"
                style={{ backgroundColor: colors.primary }}
              />
            </View>
          </>
        )}
      </Modal>

      {/* Orders Modal */}
      <Modal
        visible={showOrders}
        onClose={() => setShowOrders(false)}
        title="Order History"
      >
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No orders yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>Your order history will appear here</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {orders.map(order => (
              <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                    <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{order.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                    <Ionicons name={getStatusIcon(order.status)} size={16} color={getStatusColor(order.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <Text key={index} style={[styles.orderItemText, { color: colors.textSecondary }]}>
                      {item.emoji} {item.name} x{item.quantity}
                    </Text>
                  ))}
                </View>
                <View style={styles.orderFooter}>
                  <Text style={[styles.orderTotal, { color: colors.text }]}>Total: ${order.total.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </Modal>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productEmoji: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 13,
    marginBottom: 6,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  bottomPadding: {
    height: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  cartItems: {
    maxHeight: 400,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  cartItemEmoji: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cartItemEmojiText: {
    fontSize: 24,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  cartItemActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  cartFooter: {
    borderTopWidth: 1,
    paddingTop: 20,
    paddingBottom: 8,
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    gap: 6,
    marginBottom: 12,
  },
  orderItemText: {
    fontSize: 14,
  },
  orderFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
});