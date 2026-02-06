-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Profiles RLS Policies
-- Master can see and manage all profiles
CREATE POLICY "master_view_all_profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'master'
    )
  );

CREATE POLICY "master_insert_profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'master'
    )
  );

CREATE POLICY "master_update_profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'master'
    )
  );

CREATE POLICY "master_delete_profiles" ON public.profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'master'
    )
  );

-- Admin can see and manage non-master profiles
CREATE POLICY "admin_view_profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) AND role != 'master'
  );

CREATE POLICY "admin_insert_profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) AND role IN ('agent', 'customer')
  );

CREATE POLICY "admin_update_profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) AND role IN ('agent', 'customer')
  );

-- Agent and Customer can view their own profile
CREATE POLICY "users_view_own_profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE USING (
    id = auth.uid() AND 
    role IN ('agent', 'customer')
  ) WITH CHECK (
    id = auth.uid() AND 
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Transactions RLS Policies
-- Master and Admin can view all transactions
CREATE POLICY "master_admin_view_all_transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('master', 'admin')
    )
  );

-- Master and Admin can manage transactions
CREATE POLICY "master_admin_manage_transactions" ON public.transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('master', 'admin')
    )
  );

-- Users can view their own transactions
CREATE POLICY "users_view_own_transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

-- Users can create their own transactions
CREATE POLICY "users_create_transactions" ON public.transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Products RLS Policies
-- Everyone can view active products
CREATE POLICY "view_active_products" ON public.products
  FOR SELECT USING (is_active = true);

-- Master and Admin can view all products
CREATE POLICY "master_admin_view_all_products" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('master', 'admin')
    )
  );

-- Master and Admin can manage products
CREATE POLICY "master_admin_manage_products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('master', 'admin')
    )
  );

-- Activity Logs RLS Policies
-- Master can view all logs
CREATE POLICY "master_view_all_logs" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'master'
    )
  );

-- Admin can view non-master logs
CREATE POLICY "admin_view_logs" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Anyone authenticated can insert activity logs
CREATE POLICY "authenticated_insert_logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can view their own logs
CREATE POLICY "users_view_own_logs" ON public.activity_logs
  FOR SELECT USING (user_id = auth.uid());
